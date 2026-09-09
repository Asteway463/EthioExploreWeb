import pool, { memoryStore, getIsMySqlAvailable } from "../config/database.js";

/**
 * Get comments for a destination
 */
export async function getCommentsByDestination(destinationId) {
  const destId = destinationId.toLowerCase().trim();

  if (getIsMySqlAvailable() && pool) {
    try {
      const [rows] = await pool.execute(
        `SELECT id, destination_id, user_id, user_name, text, created_at, updated_at 
         FROM comments 
         WHERE LOWER(destination_id) = ? 
         ORDER BY created_at DESC`,
        [destId]
      );
      return rows;
    } catch (err) {
      console.warn("MySQL query error in getCommentsByDestination:", err.message);
    }
  }

  return memoryStore.comments
    .filter((c) => c.destination_id.toLowerCase() === destId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Create a new comment
 */
export async function createComment({ destinationId, userId, userName, text }) {
  const destId = destinationId.toLowerCase().trim();
  const trimmedText = text.trim();

  if (getIsMySqlAvailable() && pool) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO comments (destination_id, user_id, user_name, text) VALUES (?, ?, ?, ?)`,
        [destId, userId, userName, trimmedText]
      );
      return {
        id: result.insertId,
        destination_id: destId,
        user_id: userId,
        user_name: userName,
        text: trimmedText,
        created_at: new Date().toISOString(),
      };
    } catch (err) {
      console.warn("MySQL query error in createComment:", err.message);
    }
  }

  const newId = memoryStore.comments.length ? Math.max(...memoryStore.comments.map((c) => c.id)) + 1 : 1;
  const newComment = {
    id: newId,
    destination_id: destId,
    user_id: Number(userId),
    user_name: userName,
    text: trimmedText,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  memoryStore.comments.unshift(newComment);
  return newComment;
}

/**
 * Update an existing comment
 */
export async function updateComment(commentId, userId, newText, isAdmin = false) {
  const cId = Number(commentId);
  const trimmed = newText.trim();

  if (getIsMySqlAvailable() && pool) {
    try {
      const query = isAdmin
        ? `UPDATE comments SET text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
        : `UPDATE comments SET text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`;
      const params = isAdmin ? [trimmed, cId] : [trimmed, cId, userId];
      const [result] = await pool.execute(query, params);
      if (result.affectedRows > 0) {
        return { id: cId, text: trimmed, updated_at: new Date().toISOString() };
      }
      return null;
    } catch (err) {
      console.warn("MySQL update error in updateComment:", err.message);
    }
  }

  const comment = memoryStore.comments.find((c) => c.id === cId);
  if (!comment) return null;
  if (!isAdmin && comment.user_id !== Number(userId)) {
    throw new Error("Unauthorized to edit this comment");
  }

  comment.text = trimmed;
  comment.updated_at = new Date().toISOString();
  return comment;
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId, userId, isAdmin = false) {
  const cId = Number(commentId);

  if (getIsMySqlAvailable() && pool) {
    try {
      const query = isAdmin
        ? `DELETE FROM comments WHERE id = ?`
        : `DELETE FROM comments WHERE id = ? AND user_id = ?`;
      const params = isAdmin ? [cId] : [cId, userId];
      const [result] = await pool.execute(query, params);
      return result.affectedRows > 0;
    } catch (err) {
      console.warn("MySQL delete error in deleteComment:", err.message);
    }
  }

  const index = memoryStore.comments.findIndex((c) => c.id === cId);
  if (index === -1) return false;

  const comment = memoryStore.comments[index];
  if (!isAdmin && comment.user_id !== Number(userId)) {
    throw new Error("Unauthorized to delete this comment");
  }

  memoryStore.comments.splice(index, 1);
  return true;
}

export default {
  getCommentsByDestination,
  createComment,
  updateComment,
  deleteComment,
};
