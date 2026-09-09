import pool, { memoryStore, getIsMySqlAvailable } from "../config/database.js";

/**
 * Find user by email
 */
export async function findByEmail(email) {
  const normalizedEmail = email.toLowerCase().trim();

  if (getIsMySqlAvailable() && pool) {
    try {
      const [rows] = await pool.execute(
        "SELECT id, name, email, password, role, created_at FROM users WHERE LOWER(email) = ? LIMIT 1",
        [normalizedEmail]
      );
      return rows[0] || null;
    } catch (err) {
      console.warn("MySQL query error in findByEmail, falling back to memory store:", err.message);
    }
  }

  const user = memoryStore.users.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  return user || null;
}

/**
 * Find user by ID
 */
export async function findById(id) {
  const numericId = Number(id);

  if (getIsMySqlAvailable() && pool) {
    try {
      const [rows] = await pool.execute(
        "SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1",
        [numericId]
      );
      return rows[0] || null;
    } catch (err) {
      console.warn("MySQL query error in findById, falling back to memory store:", err.message);
    }
  }

  const user = memoryStore.users.find((u) => u.id === numericId);
  if (!user) return null;

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Create a new user
 */
export async function createUser({ name, email, password, role = "user" }) {
  const normalizedEmail = email.toLowerCase().trim();

  if (getIsMySqlAvailable() && pool) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, normalizedEmail, password, role]
      );
      return {
        id: result.insertId,
        name,
        email: normalizedEmail,
        role,
      };
    } catch (err) {
      console.warn("MySQL query error in createUser, falling back to memory store:", err.message);
    }
  }

  const newId = memoryStore.users.length ? Math.max(...memoryStore.users.map((u) => u.id)) + 1 : 1;
  const newUser = {
    id: newId,
    name,
    email: normalizedEmail,
    password,
    role,
    created_at: new Date().toISOString(),
  };
  memoryStore.users.push(newUser);

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
}

export default {
  findByEmail,
  findById,
  createUser,
};
