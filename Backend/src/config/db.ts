import mongoose from "mongoose";
import dns from "dns";
import { env } from "./env";

// =============================
// Fix SRV DNS ECONNREFUSED Issue
// =============================

const currentServers = dns.getServers();

if (currentServers.includes("127.0.0.1")) {
  console.warn(
    "⚠ Local DNS 127.0.0.1 detected — switching to Google DNS (8.8.8.8)"
  );

  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

// =============================
// MongoDB Connection
// =============================

export const connectDB = async (): Promise<void> => {
  try {
    if (!env.MONGO_URI) {
      throw new Error("MONGO_URI not defined in environment variables");
    }

    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error: any) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};