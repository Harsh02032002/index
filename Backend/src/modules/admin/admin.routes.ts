import { Router } from "express";
import * as adminController from "./admin.controller";
import { authenticate, authorize } from "../../shared/middlewares/auth.middleware";

const router = Router();

// Protect all admin routes
router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", adminController.dashboard);

router.get("/orders", adminController.fetchOrders);
router.patch("/orders/:id/status", adminController.updateOrderStatus);

router.get("/menu", adminController.fetchMenu);
router.delete("/menu/:id", adminController.deleteMenu);

router.get("/sellers", adminController.fetchSellers);
router.patch("/sellers/:id/status", adminController.updateSellerStatus);
router.get("/sellers", adminController.fetchSellers);
router.get("/customers", adminController.fetchCustomers);

router.patch(
  "/users/:id/status",
  adminController.updateUserStatus
);
export default router;