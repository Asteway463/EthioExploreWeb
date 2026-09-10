import pg from "pg";
import dotenv from "dotenv";

const { Pool } = pg;
dotenv.config();

let pool = null;
let isDatabaseAvailable = false;

export const memoryStore = {
  users: [],
  destinations: [],
  comments: [],
  ratings: [],
  photos: [],
  favorites: [],
  trips: [],
};

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  try {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("neon.tech") ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  } catch (err) {
    console.warn("⚠️ PostgreSQL pool creation failed:", err.message);
  }
}

export async function testConnection() {
  if (!pool) {
    console.warn("⚠️ DATABASE_URL is not configured. PostgreSQL is unavailable.");
    isDatabaseAvailable = false;
    return false;
  }

  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL database connected successfully.");
    isDatabaseAvailable = true;
    return true;
  } catch (error) {
    console.warn("⚠️ PostgreSQL connection failed:", error.message);
    isDatabaseAvailable = false;
    return false;
  }
}

export async function ensureDatabaseSchema() {
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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      destination_id VARCHAR(255) NOT NULL,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user_name VARCHAR(255) NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      destination_id VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (user_id, destination_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS photos (
      id SERIAL PRIMARY KEY,
      destination_id VARCHAR(255) NOT NULL,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user_name VARCHAR(255) NOT NULL,
      image_url TEXT NOT NULL,
      caption TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      destination_id VARCHAR(255) NOT NULL,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (destination_id, user_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS trips (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      starting_point VARCHAR(255) DEFAULT 'Addis Ababa',
      travellers INTEGER NOT NULL DEFAULT 2,
      days INTEGER NOT NULL DEFAULT 7,
      destinations_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      total_cost_etb INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  return true;
}

export function getIsDatabaseAvailable() {
  return isDatabaseAvailable;
}

// Backward-compatible alias for older modules still referencing the old name.
export function getIsMySqlAvailable() {
  return isDatabaseAvailable;
}

export { pool };
export default pool;
