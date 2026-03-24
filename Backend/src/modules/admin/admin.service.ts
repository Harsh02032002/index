import Order from "../order/order.model";
import Menu from "../menu/menu.model";
import User from "../user/user.model";
import { AppError } from "../../shared/middlewares/error.middleware";

// ==========================
// Dashboard
// ==========================

export const getDashboardStats = async () => {
  const totalOrders = await Order.countDocuments();
  const totalMenuItems = await Menu.countDocuments();
  const totalSellers = await User.countDocuments({ role: "SELLER" });

  const revenueData = await Order.aggregate([
    { $match: { paymentStatus: "SUCCESS" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total" },
      },
    },
  ]);

  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  const activeOrders = await Order.countDocuments({
    status: { $in: ["ORDER_RECEIVED", "PREPARING", "OUT_FOR_DELIVERY"] },
  });

  return {
    totalOrders,
    totalRevenue,
    totalMenuItems,
    totalSellers,
    activeOrders,
  };
};

// ==========================
// Orders
// ==========================

export const getAllOrders = async () => {
  return Order.find().sort({ createdAt: -1 });
};

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

// ==========================
// Menu
// ==========================

export const getAllMenu = async () => {
  return Menu.find().sort({ createdAt: -1 });
};

export const deleteMenu = async (menuId: string) => {
  const menu = await Menu.findById(menuId);

  if (!menu) {
    throw new AppError("Menu item not found", 404);
  }

  await menu.deleteOne();
};

// ==========================
// Sellers
// ==========================

export const getAllSellers = async () => {
  return User.find({ role: "SELLER" }).select("-password");
};

export const changeSellerStatus = async (
  sellerId: string,
  status: "ACTIVE" | "SUSPENDED"
) => {
  const seller = await User.findById(sellerId);

  if (!seller || seller.role !== "SELLER") {
    throw new AppError("Seller not found", 404);
  }

  seller.status = status;
  await seller.save();

  return seller;
};
// Get Sellers


// Get Customers
export const getAllCustomers = async () => {
  return User.find({ role: "CUSTOMER" }).select("-password");
};

// Change User Status (Seller or Customer)
export const changeUserStatus = async (
  userId: string,
  status: "ACTIVE" | "SUSPENDED"
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "ADMIN") {
    throw new AppError("Cannot modify admin", 403);
  }

  user.status = status;
  await user.save();

  return user;
};