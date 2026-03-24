import { Response, NextFunction } from "express";
import * as sellerService from "./seller.service";
import { AuthRequest } from "../../shared/middlewares/auth.middleware";

// Dashboard
export const dashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await sellerService.getSellerDashboard(
      req.user!.userId
    );

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Menu
export const fetchMenu = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const menu = await sellerService.getSellerMenu(
      req.user!.userId
    );

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
    const item = await sellerService.createSellerMenuItem(
      req.user!.userId,
      req.body
    );

    res.status(201).json({ success: true, data: item });
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
    const item = await sellerService.updateSellerMenuItem(
      req.user!.userId,
      req.params.id,
      req.body
    );

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// Orders
export const fetchOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await sellerService.getSellerOrders(
      req.user!.userId
    );

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await sellerService.updateSellerOrderStatus(
      req.user!.userId,
      req.params.id,
      req.body.status
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};