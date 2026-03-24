import { Request, Response, NextFunction } from "express";
import * as menuService from "./menu.service";
import { AuthRequest } from "../../shared/middlewares/auth.middleware";

// ==========================
// Public
// ==========================

export const fetchPublicMenu = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const menu = await menuService.getPublicMenu();
    res.json({ success: true, data: menu });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Admin
// ==========================

export const fetchAllMenu = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const menu = await menuService.getAllMenu();
    res.json({ success: true, data: menu });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Seller
// ==========================

export const fetchSellerMenu = async (
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

    const menu = await menuService.getSellerMenu(req.user.userId);

    res.json({ success: true, data: menu });
  } catch (error) {
    next(error);
  }
};

export const createMenu = async (
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

    const item = await menuService.createMenuItem(
      req.user.userId,
      {
        ...req.body,
        image: imageUrl,
      }
    );

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMenu = async (
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

    const menuId = String(req.params.id);

    const imageUrl = (req as any).file?.path;

    const updatedData = {
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
    };

    const item = await menuService.updateMenuItem(
      req.user.userId,
      menuId,
      updatedData
    );

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const menuId = String(req.params.id);

    await menuService.deleteMenuItem(menuId);

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
};