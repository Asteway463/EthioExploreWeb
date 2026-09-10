import pg from "pg";
import dotenv from "dotenv";

const { Pool } = pg;
dotenv.config();

let pool = null;
let isDatabaseAvailable = false;

// In-memory fallback data store for resilient local development/testing
export const memoryStore = {
  users: [
    {
      id: 1,
      name: "Admin Explorer",
      email: "admin@ethioexplore.com",
      password: "$2a$10$YourHashedPasswordPlaceholder999", // Admin account
      role: "admin",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Abebe Bikila",
      email: "abebe@example.com",
      password: "$2a$10$YourHashedPasswordPlaceholder999",
      role: "user",
      created_at: new Date().toISOString(),
    },
  ],
  destinations: [],
  comments: [
    {
      id: 1,
      destination_id: "lalibela",
      user_id: 2,
      user_name: "Abebe Bikila",
      text: "Beautiful place. I really enjoyed visiting Lalibela. The underground passages between Bete Medhane Alem and Bete Maryam are miraculous.",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      destination_id: "danakil-depression",
      user_id: 2,
      user_name: "Abebe Bikila",
      text: "Erta Ale volcano at night is mesmerizing. Pack strong hiking boots and plenty of water for Dallol.",
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      destination_id: "simien-mountains",
      user_id: 1,
      user_name: "Admin Explorer",
      text: "The Gelada baboon troops were peaceful and allowed us to observe them closely along the ridge.",
      created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
  ],
  ratings: [
    { id: 1, destination_id: "lalibela", user_id: 1, rating: 5, created_at: new Date().toISOString() },
    { id: 2, destination_id: "lalibela", user_id: 2, rating: 5, created_at: new Date().toISOString() },
    { id: 3, destination_id: "simien-mountains", user_id: 2, rating: 5, created_at: new Date().toISOString() },
    { id: 4, destination_id: "danakil-depression", user_id: 2, rating: 5, created_at: new Date().toISOString() },
  ],
  photos: [
    {
      id: 1,
      destination_id: "lalibela",
      user_id: 2,
      user_name: "Abebe Bikila",
      image_url: "https://images.unsplash.com/photo-1578922864835-e9b4661a5b8a?auto=format&fit=crop&w=1200&q=80",
      caption: "Sunrise touching the cross carved atop Bete Giyorgis.",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      destination_id: "simien-mountains",
      user_id: 1,
      user_name: "Admin Explorer",
      image_url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      caption: "Escarpment edge at Sankaber camp.",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  favorites: [
    { id: 1, user_id: 2, destination_id: "lalibela", created_at: new Date().toISOString() },
    { id: 2, user_id: 2, destination_id: "danakil-depression", created_at: new Date().toISOString() },
  ],
  trips: [
    {
      id: 1,
      user_id: 2,
      title: "Northern Historical Circuit",
      starting_point: "Addis Ababa",
      travellers: 2,
      days: 7,
      destinations_json: ["lalibela", "gondar", "bahir-dar"],
      total_cost_etb: 48000,
      created_at: new Date().toISOString(),
    },
  ],
};

// Initialize PostgreSQL connection pool
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
    console.warn("⚠️ PostgreSQL pool creation skipped, using in-memory resilient store:", err.message);
  }
}

export async function testConnection() {
  if (!pool) return false;
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL database connected successfully.");
    isDatabaseAvailable = true;
    return true;
  } catch (error) {
    console.warn("ℹ️ PostgreSQL not connected:", error.message);
    console.log("🚀 EthioExplore is running with resilient persistent store fallback.");
    isDatabaseAvailable = false;
    return false;
  }
}

export function getIsDatabaseAvailable() {
  return isDatabaseAvailable;
}

export function getIsMySqlAvailable() {
  return isDatabaseAvailable;
}

export { pool };
export default pool;
