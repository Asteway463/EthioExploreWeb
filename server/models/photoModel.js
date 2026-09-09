import pool, { memoryStore, getIsMySqlAvailable } from "../config/database.js";

/**
 * Get photos for a destination
 */
export async function getPhotosByDestination(destinationId) {
  const destId = destinationId.toLowerCase().trim();

  if (getIsMySqlAvailable() && pool) {
    try {
      const [rows] = await pool.execute(
        `SELECT id, destination_id, user_id, user_name, image_url, caption, created_at 
         FROM photos 
         WHERE LOWER(destination_id) = ? 
         ORDER BY created_at DESC`,
        [destId]
      );
      return rows;
    } catch (err) {
      console.warn("MySQL query error in getPhotosByDestination:", err.message);
    }
  }

  return memoryStore.photos
    .filter((p) => p.destination_id.toLowerCase() === destId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Get all photos uploaded by a user
 */
export async function getPhotosByUser(userId) {
  const numUserId = Number(userId);

  if (getIsMySqlAvailable() && pool) {
    try {
      const [rows] = await pool.execute(
        `SELECT id, destination_id, user_id, user_name, image_url, caption, created_at 
         FROM photos 
         WHERE user_id = ? 
         ORDER BY created_at DESC`,
        [numUserId]
      );
      return rows;
    } catch (err) {
      console.warn("MySQL query error in getPhotosByUser:", err.message);
    }
  }

  return memoryStore.photos
    .filter((p) => p.user_id === numUserId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Upload a community photo
 */
export async function createPhoto({ destinationId, userId, userName, imageUrl, caption = "" }) {
  const destId = destinationId.toLowerCase().trim();
  const numUserId = Number(userId);

  if (getIsMySqlAvailable() && pool) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO photos (destination_id, user_id, user_name, image_url, caption) VALUES (?, ?, ?, ?, ?)`,
        [destId, numUserId, userName, imageUrl, caption]
      );
      return {
        id: result.insertId,
        destination_id: destId,
        user_id: numUserId,
        user_name: userName,
        image_url: imageUrl,
        caption,
        created_at: new Date().toISOString(),
      };
    } catch (err) {
      console.warn("MySQL query error in createPhoto:", err.message);
    }
  }

  const newId = memoryStore.photos.length ? Math.max(...memoryStore.photos.map((p) => p.id)) + 1 : 1;
  const newPhoto = {
    id: newId,
    destination_id: destId,
    user_id: numUserId,
    user_name: userName,
    image_url: imageUrl,
    caption,
    created_at: new Date().toISOString(),
  };

  memoryStore.photos.unshift(newPhoto);
  return newPhoto;
}

/**
 * Delete a photo (owner or admin)
 */
export async function deletePhoto(photoId, userId, isAdmin = false) {
  const pId = Number(photoId);

  if (getIsMySqlAvailable() && pool) {
    try {
      const query = isAdmin
        ? `DELETE FROM photos WHERE id = ?`
        : `DELETE FROM photos WHERE id = ? AND user_id = ?`;
      const params = isAdmin ? [pId] : [pId, userId];
      const [result] = await pool.execute(query, params);
      return result.affectedRows > 0;
    } catch (err) {
      console.warn("MySQL query error in deletePhoto:", err.message);
    }
  }

  const index = memoryStore.photos.findIndex((p) => p.id === pId);
  if (index === -1) return false;

  const photo = memoryStore.photos[index];
  if (!isAdmin && photo.user_id !== Number(userId)) {
    throw new Error("Unauthorized to delete this photo");
  }

  memoryStore.photos.splice(index, 1);
  return true;
}

export default {
  getPhotosByDestination,
  getPhotosByUser,
  createPhoto,
  deletePhoto,
};
