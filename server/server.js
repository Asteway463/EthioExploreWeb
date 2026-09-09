import app from "./app.js";
import { testConnection } from "./config/database.js";
import { ensureUsersTable } from "./models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Test MySQL connection and create tables if needed
  const isDbConnected = await testConnection();
  if (isDbConnected) {
    await ensureUsersTable();
  } else {
    console.warn("⚠️  Server is starting without an active MySQL connection. Auth requests requiring DB will fail until MySQL is available.");
  }

  app.listen(PORT, () => {
    console.log(`🚀 EthioExplore Backend server running on http://localhost:${PORT}`);
    console.log(`📡 Auth endpoints: http://localhost:${PORT}/api/auth`);
  });
}

startServer();
