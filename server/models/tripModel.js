import pool, { getIsDatabaseAvailable } from "../config/database.js";

function requireDatabase() {
  if (!getIsDatabaseAvailable() || !pool) {
    throw new Error("PostgreSQL is not available. Please configure DATABASE_URL and start the database.");
  }
}

export async function getTripsByUser(userId) {
  const numUserId = Number(userId);
  requireDatabase();

  const { rows } = await pool.query(
    `SELECT id, user_id, title, starting_point, travellers, days, destinations_json, total_cost_etb, created_at, updated_at
     FROM trips
     WHERE user_id = $1
     ORDER BY updated_at DESC`,
    [numUserId]
  );

  return rows.map((r) => ({
    ...r,
    destinations: typeof r.destinations_json === "string" ? JSON.parse(r.destinations_json) : r.destinations_json,
  }));
}

export async function getTripById(tripId, userId) {
  const tId = Number(tripId);
  const numUserId = Number(userId);
  requireDatabase();

  const { rows } = await pool.query(
    `SELECT id, user_id, title, starting_point, travellers, days, destinations_json, total_cost_etb, created_at, updated_at
     FROM trips
     WHERE id = $1 AND user_id = $2 LIMIT 1`,
    [tId, numUserId]
  );

  if (!rows[0]) return null;

  return {
    ...rows[0],
    destinations: typeof rows[0].destinations_json === "string" ? JSON.parse(rows[0].destinations_json) : rows[0].destinations_json,
  };
}

export async function createTrip({ userId, title, startingPoint = "Addis Ababa", travellers = 2, days = 7, destinations = [], totalCostEtb = 0 }) {
  const numUserId = Number(userId);
  const jsonStops = JSON.stringify(destinations);
  requireDatabase();

  const result = await pool.query(
    `INSERT INTO trips (user_id, title, starting_point, travellers, days, destinations_json, total_cost_etb)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, user_id, title, starting_point, travellers, days, destinations_json, total_cost_etb, created_at, updated_at`,
    [numUserId, title, startingPoint, travellers, days, jsonStops, totalCostEtb]
  );

  const row = result.rows[0];
  return {
    ...row,
    destinations: JSON.parse(row.destinations_json),
  };
}

export async function updateTrip(tripId, userId, { title, startingPoint, travellers, days, destinations, totalCostEtb }) {
  const tId = Number(tripId);
  const numUserId = Number(userId);
  const jsonStops = JSON.stringify(destinations);
  requireDatabase();

  const result = await pool.query(
    `UPDATE trips
     SET title = $1, starting_point = $2, travellers = $3, days = $4, destinations_json = $5, total_cost_etb = $6, updated_at = NOW()
     WHERE id = $7 AND user_id = $8
     RETURNING id, user_id, title, starting_point, travellers, days, destinations_json, total_cost_etb, created_at, updated_at`,
    [title, startingPoint, travellers, days, jsonStops, totalCostEtb, tId, numUserId]
  );

  if (!result.rows[0]) return null;

  return {
    ...result.rows[0],
    destinations: JSON.parse(result.rows[0].destinations_json),
  };
}

export async function deleteTrip(tripId, userId) {
  const tId = Number(tripId);
  const numUserId = Number(userId);
  requireDatabase();

  const result = await pool.query(
    `DELETE FROM trips WHERE id = $1 AND user_id = $2`,
    [tId, numUserId]
  );

  return result.rowCount > 0;
}

export default {
  getTripsByUser,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
};
