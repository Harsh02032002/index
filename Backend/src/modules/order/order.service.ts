import Order from "./order.model";
import { AppError } from "../../shared/middlewares/error.middleware";

// Create Order
export const createOrder = async (data: any) => {
  const order = await Order.create(data);
  return order;
};

// Get Order by ID
export const getOrderById = async (id: string) => {
  const order = await Order.findById(id);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
};

// Admin - All Orders
export const getAllOrders = async () => {
  return Order.find().sort({ createdAt: -1 });
};

// Seller Orders
export const getSellerOrders = async (sellerId: string) => {
  return Order.find({ sellerId }).sort({ createdAt: -1 });
};

// User Orders
export const getMyOrders = async (userId: string) => {
  return Order.find({ userId }).sort({ createdAt: -1 });
};

// Update Status
export const updateOrderStatus = async (
  orderId: string,
  status: string
) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  order.status = status as any;
  await order.save();

  return order;
};