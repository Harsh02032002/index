import { Router } from "express";

// Public Routes
import menuRoutes from "./modules/menu/menu.routes";
import orderRoutes from "./modules/order/order.routes";
import paymentRoutes from "./modules/payment/payment.routes";

// Admin Routes
import adminRoutes from "./modules/admin/admin.routes";

// Seller Routes
import sellerRoutes from "./modules/seller/seller.routes";
import authRoutes from "./modules/auth/auth.routes";
const router = Router();

// Public
router.use("/menu", menuRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);

// Admin
router.use("/admin", adminRoutes);

// Seller
router.use("/seller", sellerRoutes);
router.use("/auth", authRoutes);
export default router;