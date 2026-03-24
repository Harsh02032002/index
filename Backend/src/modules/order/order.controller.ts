import { Response, NextFunction } from "express";
import * as orderService from "./order.service";
import { AuthRequest } from "../../shared/middlewares/auth.middleware";
import { AppError } from "../../shared/middlewares/error.middleware";
import Menu from "../menu/menu.model";
import Order from "./order.model";
// Helper to safely extract param id
const getParamId = (param: string | string[] | undefined): string => {
  if (!param || Array.isArray(param)) {
    throw new AppError("Invalid ID parameter", 400);
  }
  return param;
};

// Create Order
// order.controller.ts - createOrder

export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    if (!data.items || data.items.length === 0) {
      throw new AppError("Order must contain items", 400);
    }

    // Get first menu item to extract sellerId
    const firstItem = await Menu.findById(data.items[0].menuItemId);

    if (!firstItem) {
      throw new AppError("Invalid menu item", 400);
    }

    const sellerId = firstItem.sellerId;

    // Validate all items belong to same seller
    for (const item of data.items) {
      const menuItem = await Menu.findById(item.menuItemId);
      if (!menuItem) {
        throw new AppError("Invalid menu item in cart", 400);
      }

      if (menuItem.sellerId.toString() !== sellerId.toString()) {
        throw new AppError(
          "All items in cart must belong to same seller",
          400
        );
      }
    }

    const order = await Order.create({
      customer: data.customer,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      sellerId,
      userId: req.user?.userId,
      status: "ORDER_RECEIVED",
      paymentStatus: data.paymentMethod === "cash" ? "pending" : "processing",
      paymentMethod: data.paymentMethod || "cash",
      items: data.items.map((item: any) => ({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};



// Get Single Order
export const fetchOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = getParamId(req.params.id);

    const order = await orderService.getOrderById(orderId);

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// Admin All Orders
export const fetchAllOrders = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// Seller Orders
export const fetchSellerOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const orders = await orderService.getSellerOrders(
      req.user.userId
    );

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// User Orders
export const fetchMyOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const orders = await orderService.getMyOrders(
      req.user.userId
    );

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// Update Status (Admin + Seller Safe)
export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const orderId = getParamId(req.params.id);

    const order = await orderService.getOrderById(orderId);

    // Seller can only update their own orders
    if (
      req.user.role === "SELLER" &&
      order.sellerId.toString() !== req.user.userId
    ) {
      throw new AppError("Forbidden", 403);
    }

    const updated = await orderService.updateOrderStatus(
      orderId,
      req.body.status
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};