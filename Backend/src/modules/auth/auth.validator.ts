import { z } from "zod";

// --------------------
// Register Validation
// --------------------

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name too long"),

    email: z
      .string()
      .email("Invalid email format"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100),

    role: z.enum(["CUSTOMER", "SELLER"]),
  }),
});

// --------------------
// Login Validation
// --------------------

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email format"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  }),
});