import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { AuthRequest } from "../../shared/middlewares/auth.middleware";
import User from "../user/user.model";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role } = req.body;

    if (!["CUSTOMER", "SELLER"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await authService.registerUser(
      name,
      email,
      password,
      role
    );

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await authService.loginUser(
      email,
      password
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?.userId).select("-password");

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfileImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const imageUrl = (req as any).file?.path;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { profileImage: imageUrl },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      { name },
      { new: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};
