import app from "./app.js";
import { testConnection } from "./config/database.js";
import { ensureUsersTable } from "./models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_PORT = Number(process.env.PORT) || 5000;

function startOnPort(port, fallbackPorts = [5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008, 5009, 5010]) {
  const server = app.listen(port, () => {
    console.log(
      `🚀 EthioExplore Backend server running on http://localhost:${port}`
    );

    console.log(
      `📡 Auth endpoints: http://localhost:${port}/api/auth`
    );
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const nextPort = fallbackPorts.shift();

      if (nextPort) {
        console.warn(`⚠️ Port ${port} is busy. Retrying on ${nextPort}...`);
        startOnPort(nextPort, fallbackPorts);
        return;
      }

      console.error("❌ No free backend ports available. Please stop another process or change PORT in your .env file.");
      process.exit(1);
    }

    throw error;
  });
}

async function startServer() {
  const isDbConnected = await testConnection();

  if (isDbConnected) {
    await ensureUsersTable();
  } else {
    console.warn(
      "⚠️ Server is starting without an active PostgreSQL connection. " +
      "Database requests will fail until PostgreSQL is available."
    );
  }

  startOnPort(DEFAULT_PORT);
}

startServer();
