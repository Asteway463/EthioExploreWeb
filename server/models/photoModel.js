import pool, { getIsDatabaseAvailable } from "../config/database.js";

function requireDatabase() {
  if (!getIsDatabaseAvailable() || !pool) {
    throw new Error("PostgreSQL is not available. Please configure DATABASE_URL and start the database.");
  }
}

export async function getPhotosByDestination(destinationId) {
  const destId = destinationId.toLowerCase().trim();
  requireDatabase();

  const { rows } = await pool.query(
    `SELECT id, destination_id, user_id, user_name, image_url, caption, created_at
     FROM photos
     WHERE LOWER(destination_id) = $1
     ORDER BY created_at DESC`,
    [destId]
  );

  return rows;
}

export async function getPhotosByUser(userId) {
  const numUserId = Number(userId);
  requireDatabase();

  const { rows } = await pool.query(
    `SELECT id, destination_id, user_id, user_name, image_url, caption, created_at
     FROM photos
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [numUserId]
  );

  return rows;
}

export async function createPhoto({ destinationId, userId, userName, imageUrl, caption = "" }) {
  const destId = destinationId.toLowerCase().trim();
  const numUserId = Number(userId);
  requireDatabase();

  const result = await pool.query(
    `INSERT INTO photos (destination_id, user_id, user_name, image_url, caption)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, destination_id, user_id, user_name, image_url, caption, created_at`,
    [destId, numUserId, userName, imageUrl, caption]
  );

  return result.rows[0];
}

export async function deletePhoto(photoId, userId, isAdmin = false) {
  const pId = Number(photoId);
  requireDatabase();

  const query = isAdmin
    ? `DELETE FROM photos WHERE id = $1`
    : `DELETE FROM photos WHERE id = $1 AND user_id = $2`;
  const params = isAdmin ? [pId] : [pId, userId];
  const result = await pool.query(query, params);

  return result.rowCount > 0;
}

export default {
  getPhotosByDestination,
  getPhotosByUser,
  createPhoto,
  deletePhoto,
};
