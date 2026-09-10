import pool, { getIsDatabaseAvailable } from "../config/database.js";

function requireDatabase() {
  if (!getIsDatabaseAvailable() || !pool) {
    throw new Error("PostgreSQL is not available. Please configure DATABASE_URL and start the database.");
  }
}

export async function getCommentsByDestination(destinationId) {
  const destId = destinationId.toLowerCase().trim();
  requireDatabase();

  const { rows } = await pool.query(
    `SELECT id, destination_id, user_id, user_name, text, created_at, updated_at
     FROM comments
     WHERE LOWER(destination_id) = $1
     ORDER BY created_at DESC`,
    [destId]
  );

  return rows;
}

export async function createComment({ destinationId, userId, userName, text }) {
  const destId = destinationId.toLowerCase().trim();
  const trimmedText = text.trim();
  requireDatabase();

  const result = await pool.query(
    `INSERT INTO comments (destination_id, user_id, user_name, text)
     VALUES ($1, $2, $3, $4)
     RETURNING id, destination_id, user_id, user_name, text, created_at`,
    [destId, userId, userName, trimmedText]
  );

  return result.rows[0];
}

export async function updateComment(commentId, userId, newText, isAdmin = false) {
  const cId = Number(commentId);
  const trimmed = newText.trim();
  requireDatabase();

  const query = isAdmin
    ? `UPDATE comments SET text = $1, updated_at = NOW() WHERE id = $2 RETURNING id, text, updated_at`
    : `UPDATE comments SET text = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING id, text, updated_at`;
  const params = isAdmin ? [trimmed, cId] : [trimmed, cId, userId];
  const result = await pool.query(query, params);

  return result.rows[0] || null;
}

export async function deleteComment(commentId, userId, isAdmin = false) {
  const cId = Number(commentId);
  requireDatabase();

  const query = isAdmin
    ? `DELETE FROM comments WHERE id = $1`
    : `DELETE FROM comments WHERE id = $1 AND user_id = $2`;
  const params = isAdmin ? [cId] : [cId, userId];
  const result = await pool.query(query, params);

  return result.rowCount > 0;
}

export default {
  getCommentsByDestination,
  createComment,
  updateComment,
  deleteComment,
};
