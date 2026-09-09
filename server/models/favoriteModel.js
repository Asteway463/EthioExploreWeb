import pool, { memoryStore, getIsMySqlAvailable } from "../config/database.js";

/**
 * Get all favorite destination IDs for a user
 */
export async function getFavoritesByUser(userId) {
  const numUserId = Number(userId);

  if (getIsMySqlAvailable() && pool) {
    try {
      const [rows] = await pool.execute(
        `SELECT destination_id, created_at FROM favorites WHERE user_id = ? ORDER BY created_at DESC`,
        [numUserId]
      );
      return rows.map((r) => r.destination_id);
    } catch (err) {
      console.warn("MySQL query error in getFavoritesByUser:", err.message);
    }
  }

  return memoryStore.favorites
    .filter((f) => f.user_id === numUserId)
    .map((f) => f.destination_id);
}

/**
 * Add a destination to user favorites
 */
export async function addFavorite(userId, destinationId) {
  const numUserId = Number(userId);
  const destId = destinationId.toLowerCase().trim();

  if (getIsMySqlAvailable() && pool) {
    try {
      await pool.execute(
        `INSERT IGNORE INTO favorites (user_id, destination_id) VALUES (?, ?)`,
        [numUserId, destId]
      );
      return true;
    } catch (err) {
      console.warn("MySQL query error in addFavorite:", err.message);
    }
  }

  const exists = memoryStore.favorites.some(
    (f) => f.user_id === numUserId && f.destination_id.toLowerCase() === destId
  );
  if (!exists) {
    const newId = memoryStore.favorites.length
      ? Math.max(...memoryStore.favorites.map((f) => f.id)) + 1
      : 1;
    memoryStore.favorites.push({
      id: newId,
      user_id: numUserId,
      destination_id: destId,
      created_at: new Date().toISOString(),
    });
  }
  return true;
}

/**
 * Remove a destination from user favorites
 */
export async function removeFavorite(userId, destinationId) {
  const numUserId = Number(userId);
  const destId = destinationId.toLowerCase().trim();

  if (getIsMySqlAvailable() && pool) {
    try {
      const [result] = await pool.execute(
        `DELETE FROM favorites WHERE user_id = ? AND LOWER(destination_id) = ?`,
        [numUserId, destId]
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.warn("MySQL query error in removeFavorite:", err.message);
    }
  }

  const index = memoryStore.favorites.findIndex(
    (f) => f.user_id === numUserId && f.destination_id.toLowerCase() === destId
  );
  if (index >= 0) {
    memoryStore.favorites.splice(index, 1);
    return true;
  }
  return false;
}

export default {
  getFavoritesByUser,
  addFavorite,
  removeFavorite,
};
