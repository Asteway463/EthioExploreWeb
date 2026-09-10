import pool, { getIsDatabaseAvailable } from "../config/database.js";

function requireDatabase() {
  if (!getIsDatabaseAvailable() || !pool) {
    throw new Error("PostgreSQL is not available. Please configure DATABASE_URL and start the database.");
  }
}

export async function getRatingsByDestination(destinationId) {
  const destId = destinationId.toLowerCase().trim();
  requireDatabase();

  const { rows } = await pool.query(
    `SELECT COUNT(*)::int as count, AVG(rating)::float as average
     FROM ratings WHERE LOWER(destination_id) = $1`,
    [destId]
  );

  const count = Number(rows[0]?.count || 0);
  const average = count > 0 ? Number(Number(rows[0]?.average).toFixed(1)) : 0;

  return { average, count, destination_id: destId };
}

export async function submitRating({ destinationId, userId, rating }) {
  const destId = destinationId.toLowerCase().trim();
  const numRating = Math.max(1, Math.min(5, Math.round(Number(rating))));
  const numUserId = Number(userId);
  requireDatabase();

  await pool.query(
    `INSERT INTO ratings (destination_id, user_id, rating)
     VALUES ($1, $2, $3)
     ON CONFLICT (destination_id, user_id)
     DO UPDATE SET rating = EXCLUDED.rating, updated_at = NOW()`,
    [destId, numUserId, numRating]
  );

  return getRatingsByDestination(destId);
}

export async function getUserRating(destinationId, userId) {
  const destId = destinationId.toLowerCase().trim();
  const numUserId = Number(userId);
  requireDatabase();

  const { rows } = await pool.query(
    `SELECT rating FROM ratings WHERE LOWER(destination_id) = $1 AND user_id = $2 LIMIT 1`,
    [destId, numUserId]
  );

  return rows[0]?.rating || null;
}

export default {
  getRatingsByDestination,
  submitRating,
  getUserRating,
};
