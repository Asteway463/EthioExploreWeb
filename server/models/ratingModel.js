import pool, { memoryStore, getIsMySqlAvailable } from "../config/database.js";

/**
 * Get ratings summary for a destination
 */
export async function getRatingsByDestination(destinationId) {
  const destId = destinationId.toLowerCase().trim();

  if (getIsMySqlAvailable() && pool) {
    try {
      const [rows] = await pool.execute(
        `SELECT COUNT(*) as count, AVG(rating) as average FROM ratings WHERE LOWER(destination_id) = ?`,
        [destId]
      );
      const count = Number(rows[0]?.count || 0);
      const average = count > 0 ? Number(Number(rows[0]?.average).toFixed(1)) : 0;
      return { average, count, destination_id: destId };
    } catch (err) {
      console.warn("MySQL query error in getRatingsByDestination:", err.message);
    }
  }

  const destRatings = memoryStore.ratings.filter(
    (r) => r.destination_id.toLowerCase() === destId
  );
  const count = destRatings.length;
  const average =
    count > 0
      ? Number((destRatings.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1))
      : 0;

  return { average, count, destination_id: destId };
}

/**
 * Add or update rating by authenticated user
 */
export async function submitRating({ destinationId, userId, rating }) {
  const destId = destinationId.toLowerCase().trim();
  const numRating = Math.max(1, Math.min(5, Math.round(Number(rating))));
  const numUserId = Number(userId);

  if (getIsMySqlAvailable() && pool) {
    try {
      await pool.execute(
        `INSERT INTO ratings (destination_id, user_id, rating) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP`,
        [destId, numUserId, numRating]
      );
      return getRatingsByDestination(destId);
    } catch (err) {
      console.warn("MySQL query error in submitRating:", err.message);
    }
  }

  const existingIdx = memoryStore.ratings.findIndex(
    (r) => r.destination_id.toLowerCase() === destId && r.user_id === numUserId
  );

  if (existingIdx >= 0) {
    memoryStore.ratings[existingIdx].rating = numRating;
    memoryStore.ratings[existingIdx].updated_at = new Date().toISOString();
  } else {
    const newId = memoryStore.ratings.length
      ? Math.max(...memoryStore.ratings.map((r) => r.id)) + 1
      : 1;
    memoryStore.ratings.push({
      id: newId,
      destination_id: destId,
      user_id: numUserId,
      rating: numRating,
      created_at: new Date().toISOString(),
    });
  }

  return getRatingsByDestination(destId);
}

/**
 * Get user's rating for a destination
 */
export async function getUserRating(destinationId, userId) {
  const destId = destinationId.toLowerCase().trim();
  const numUserId = Number(userId);

  if (getIsMySqlAvailable() && pool) {
    try {
      const [rows] = await pool.execute(
        `SELECT rating FROM ratings WHERE LOWER(destination_id) = ? AND user_id = ? LIMIT 1`,
        [destId, numUserId]
      );
      return rows[0]?.rating || null;
    } catch (err) {
      console.warn("MySQL query error in getUserRating:", err.message);
    }
  }

  const userRating = memoryStore.ratings.find(
    (r) => r.destination_id.toLowerCase() === destId && r.user_id === numUserId
  );
  return userRating ? userRating.rating : null;
}

export default {
  getRatingsByDestination,
  submitRating,
  getUserRating,
};
