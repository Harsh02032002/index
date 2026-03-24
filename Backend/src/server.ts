import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { initSocket } from "./config/socket";

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    // Initialize Socket
    initSocket(server);

    server.listen(env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();