import pool, { memoryStore, getIsMySqlAvailable } from "../config/database.js";

/**
 * Get all trips for a user
 */
export async function getTripsByUser(userId) {
  const numUserId = Number(userId);

  if (getIsMySqlAvailable() && pool) {
    try {
      const [rows] = await pool.execute(
        `SELECT id, user_id, title, starting_point, travellers, days, destinations_json, total_cost_etb, created_at, updated_at 
         FROM trips 
         WHERE user_id = ? 
         ORDER BY updated_at DESC`,
        [numUserId]
      );
      return rows.map((r) => ({
        ...r,
        destinations: typeof r.destinations_json === "string" ? JSON.parse(r.destinations_json) : r.destinations_json,
      }));
    } catch (err) {
      console.warn("MySQL query error in getTripsByUser:", err.message);
    }
  }

  return memoryStore.trips
    .filter((t) => t.user_id === numUserId)
    .map((t) => ({
      ...t,
      destinations: t.destinations_json,
    }))
    .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));
}

/**
 * Get trip by ID
 */
export async function getTripById(tripId, userId) {
  const tId = Number(tripId);
  const numUserId = Number(userId);

  if (getIsMySqlAvailable() && pool) {
    try {
      const [rows] = await pool.execute(
        `SELECT id, user_id, title, starting_point, travellers, days, destinations_json, total_cost_etb, created_at, updated_at 
         FROM trips 
         WHERE id = ? AND user_id = ? LIMIT 1`,
        [tId, numUserId]
      );
      if (rows[0]) {
        return {
          ...rows[0],
          destinations: typeof rows[0].destinations_json === "string" ? JSON.parse(rows[0].destinations_json) : rows[0].destinations_json,
        };
      }
      return null;
    } catch (err) {
      console.warn("MySQL query error in getTripById:", err.message);
    }
  }

  const trip = memoryStore.trips.find((t) => t.id === tId && t.user_id === numUserId);
  if (!trip) return null;
  return {
    ...trip,
    destinations: trip.destinations_json,
  };
}

/**
 * Save / create new trip
 */
export async function createTrip({ userId, title, startingPoint = "Addis Ababa", travellers = 2, days = 7, destinations = [], totalCostEtb = 0 }) {
  const numUserId = Number(userId);
  const jsonStops = JSON.stringify(destinations);

  if (getIsMySqlAvailable() && pool) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO trips (user_id, title, starting_point, travellers, days, destinations_json, total_cost_etb) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [numUserId, title, startingPoint, travellers, days, jsonStops, totalCostEtb]
      );
      return {
        id: result.insertId,
        user_id: numUserId,
        title,
        starting_point: startingPoint,
        travellers,
        days,
        destinations,
        total_cost_etb: totalCostEtb,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (err) {
      console.warn("MySQL query error in createTrip:", err.message);
    }
  }

  const newId = memoryStore.trips.length ? Math.max(...memoryStore.trips.map((t) => t.id)) + 1 : 1;
  const newTrip = {
    id: newId,
    user_id: numUserId,
    title: title || `Ethiopia Trip #${newId}`,
    starting_point: startingPoint,
    travellers: Number(travellers),
    days: Number(days),
    destinations_json: destinations,
    total_cost_etb: Number(totalCostEtb),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  memoryStore.trips.unshift(newTrip);
  return {
    ...newTrip,
    destinations,
  };
}

/**
 * Update trip
 */
export async function updateTrip(tripId, userId, { title, startingPoint, travellers, days, destinations, totalCostEtb }) {
  const tId = Number(tripId);
  const numUserId = Number(userId);
  const jsonStops = JSON.stringify(destinations);

  if (getIsMySqlAvailable() && pool) {
    try {
      const [result] = await pool.execute(
        `UPDATE trips 
         SET title = ?, starting_point = ?, travellers = ?, days = ?, destinations_json = ?, total_cost_etb = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ? AND user_id = ?`,
        [title, startingPoint, travellers, days, jsonStops, totalCostEtb, tId, numUserId]
      );
      if (result.affectedRows > 0) {
        return getTripById(tId, numUserId);
      }
      return null;
    } catch (err) {
      console.warn("MySQL update error in updateTrip:", err.message);
    }
  }

  const index = memoryStore.trips.findIndex((t) => t.id === tId && t.user_id === numUserId);
  if (index === -1) return null;

  memoryStore.trips[index] = {
    ...memoryStore.trips[index],
    title: title ?? memoryStore.trips[index].title,
    starting_point: startingPoint ?? memoryStore.trips[index].starting_point,
    travellers: travellers ?? memoryStore.trips[index].travellers,
    days: days ?? memoryStore.trips[index].days,
    destinations_json: destinations ?? memoryStore.trips[index].destinations_json,
    total_cost_etb: totalCostEtb ?? memoryStore.trips[index].total_cost_etb,
    updated_at: new Date().toISOString(),
  };

  return {
    ...memoryStore.trips[index],
    destinations: memoryStore.trips[index].destinations_json,
  };
}

/**
 * Delete trip
 */
export async function deleteTrip(tripId, userId) {
  const tId = Number(tripId);
  const numUserId = Number(userId);

  if (getIsMySqlAvailable() && pool) {
    try {
      const [result] = await pool.execute(
        `DELETE FROM trips WHERE id = ? AND user_id = ?`,
        [tId, numUserId]
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.warn("MySQL delete error in deleteTrip:", err.message);
    }
  }

  const index = memoryStore.trips.findIndex((t) => t.id === tId && t.user_id === numUserId);
  if (index === -1) return false;

  memoryStore.trips.splice(index, 1);
  return true;
}

export default {
  getTripsByUser,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
};
