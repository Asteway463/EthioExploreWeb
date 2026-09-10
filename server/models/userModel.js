import pool, { getIsDatabaseAvailable } from "../config/database.js";

function requireDatabase() {
  if (!getIsDatabaseAvailable() || !pool) {
    throw new Error("PostgreSQL is not available. Please configure DATABASE_URL and start the database.");
  }
}

export async function findByEmail(email) {
  const normalizedEmail = email.toLowerCase().trim();
  requireDatabase();

  const { rows } = await pool.query(
    "SELECT id, name, email, password, role, created_at FROM users WHERE LOWER(email) = $1 LIMIT 1",
    [normalizedEmail]
  );

  return rows[0] || null;
}

export async function findById(id) {
  const numericId = Number(id);
  requireDatabase();

  const { rows } = await pool.query(
    "SELECT id, name, email, password, role, created_at FROM users WHERE id = $1 LIMIT 1",
    [numericId]
  );

  return rows[0] || null;
}

export async function createUser({ name, email, password, role = "user" }) {
  const normalizedEmail = email.toLowerCase().trim();
  requireDatabase();

  const result = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
    [name, normalizedEmail, password, role]
  );

  const user = result.rows[0];
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function ensureUsersTable() {
  if (!pool) {
    throw new Error("PostgreSQL pool is not initialized. Check DATABASE_URL.");
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  return true;
}

export default {
  findByEmail,
  findById,
  createUser,
  ensureUsersTable,
};
