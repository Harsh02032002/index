import express from "express";
import cors from "cors";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./shared/middlewares/error.middleware";

const app = express();

// Middlewares
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
  });
});

// API Routes
app.use("/api", routes);

// Global Error Handler (Always last)
app.use(errorHandler);

export default app;