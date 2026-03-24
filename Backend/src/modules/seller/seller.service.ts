import Menu from "../menu/menu.model";
import Order from "../order/order.model";
import { AppError } from "../../shared/middlewares/error.middleware";

// ==========================
// Seller Dashboard
// ==========================

export const getSellerDashboard = async (sellerId: string) => {
  const totalOrders = await Order.countDocuments({ sellerId });

  const revenueAgg = await Order.aggregate([
    {
      $match: {
        sellerId,
        paymentStatus: "SUCCESS",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total" },
      },
    },
  ]);

  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

  const activeOrders = await Order.countDocuments({
    sellerId,
    status: { $in: ["ORDER_RECEIVED", "PREPARING", "OUT_FOR_DELIVERY"] },
  });

  return {
    totalOrders,
    totalRevenue,
    activeOrders,
  };
};

// ==========================
// Seller Menu
// ==========================

export const getSellerMenu = async (sellerId: string) => {
  return Menu.find({ sellerId }).sort({ createdAt: -1 });
};

export const createSellerMenuItem = async (
  sellerId: string,
  data: any
) => {
  return Menu.create({
    ...data,
    sellerId,
  });
};

export const updateSellerMenuItem = async (
  sellerId: string,
  menuId: string,
  data: any
) => {
  const menu = await Menu.findOne({
    _id: menuId,
    sellerId,
  });

  if (!menu) {
    throw new AppError("Menu item not found", 404);
  }

  Object.assign(menu, data);
  await menu.save();

  return menu;
};

// ==========================
// Seller Orders
// ==========================

export const getSellerOrders = async (sellerId: string) => {
  return Order.find({ sellerId }).sort({ createdAt: -1 });
};

export const updateSellerOrderStatus = async (
  sellerId: string,
  orderId: string,
  status: string
) => {
  const order = await Order.findOne({
    _id: orderId,
    sellerId,
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  order.status = status as any;
  await order.save();

  return order;
};