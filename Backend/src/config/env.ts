import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

// Force root .env load
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5000"),
  CLIENT_URL: z.string(),

  MONGO_URI: z.string(),

  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),

  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),

  RAZORPAY_KEY_ID: z.string(),
  RAZORPAY_KEY_SECRET: z.string(),

  SOCKET_CORS_ORIGIN: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;