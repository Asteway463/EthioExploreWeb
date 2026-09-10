import pool, { getIsDatabaseAvailable } from "../config/database.js";

function requireDatabase() {
  if (!getIsDatabaseAvailable() || !pool) {
    throw new Error("PostgreSQL is not available. Please configure DATABASE_URL and start the database.");
  }
}

export async function getFavoritesByUser(userId) {
  const numUserId = Number(userId);
  requireDatabase();

  const { rows } = await pool.query(
    `SELECT destination_id, created_at FROM favorites WHERE user_id = $1 ORDER BY created_at DESC`,
    [numUserId]
  );

  return rows.map((r) => r.destination_id);
}

export async function addFavorite(userId, destinationId) {
  const numUserId = Number(userId);
  const destId = destinationId.toLowerCase().trim();
  requireDatabase();

  await pool.query(
    `INSERT INTO favorites (user_id, destination_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, destination_id) DO NOTHING`,
    [numUserId, destId]
  );

  return true;
}

export async function removeFavorite(userId, destinationId) {
  const numUserId = Number(userId);
  const destId = destinationId.toLowerCase().trim();
  requireDatabase();

  const result = await pool.query(
    `DELETE FROM favorites WHERE user_id = $1 AND LOWER(destination_id) = $2`,
    [numUserId, destId]
  );

  return result.rowCount > 0;
}

export default {
  getFavoritesByUser,
  addFavorite,
  removeFavorite,
};
