import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool = null;
let isMySqlAvailable = false;

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

// Initialize connection pool
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ethioexplore_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
} catch (err) {
  console.warn("⚠️ MySQL pool creation skipped, using in-memory resilient store:", err.message);
}

export async function testConnection() {
  if (!pool) return false;
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL database connected successfully.");
    isMySqlAvailable = true;
    connection.release();
    return true;
  } catch (error) {
    console.warn("ℹ️ MySQL not connected:", error.message);
    console.log("🚀 EthioExplore is running with resilient persistent store fallback.");
    isMySqlAvailable = false;
    return false;
  }
}

export function getIsMySqlAvailable() {
  return isMySqlAvailable;
}

export { pool };
export default pool;
