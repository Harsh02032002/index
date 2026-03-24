import { Request, Response, NextFunction } from "express";
import * as adminService from "./admin.service";

// ==========================
// Dashboard
// ==========================

export const dashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await adminService.getDashboardStats();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Orders
// ==========================

export const fetchOrders = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await adminService.getAllOrders();
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = String(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const updated = await adminService.updateOrderStatus(
      orderId,
      status
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Menu
// ==========================

export const fetchMenu = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const menu = await adminService.getAllMenu();
    res.json({ success: true, data: menu });
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

    await adminService.deleteMenu(menuId);

    res.json({ success: true, message: "Menu deleted" });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Sellers
// ==========================

export const updateSellerStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sellerId = String(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const seller = await adminService.changeSellerStatus(
      sellerId,
      status
    );

    res.json({ success: true, data: seller });
  } catch (error) {
    next(error);
  }
};

export const fetchSellers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sellers = await adminService.getAllSellers();
    res.json({ success: true, data: sellers });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Customers
// ==========================

export const fetchCustomers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customers = await adminService.getAllCustomers();
    res.json({ success: true, data: customers });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = String(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const updated = await adminService.changeUserStatus(
      userId,
      status
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};