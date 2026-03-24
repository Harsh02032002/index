import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../user/user.model";
import { env } from "../../config/env";
import { AppError } from "../../shared/middlewares/error.middleware";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "CUSTOMER" | "SELLER"
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (user.status === "SUSPENDED") {
    throw new AppError("Account suspended", 403);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );

  return {
    token,
    user,
  };
};