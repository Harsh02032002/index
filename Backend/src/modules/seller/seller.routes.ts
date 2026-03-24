import { Router } from "express";
import * as sellerController from "./seller.controller";
import { authenticate, authorize } from "../../shared/middlewares/auth.middleware";

const router = Router();

// Protect seller routes
router.use(authenticate, authorize("SELLER"));

router.get("/dashboard", sellerController.dashboard);

router.get("/menu", sellerController.fetchMenu);
router.post("/menu", sellerController.createMenu);
router.put("/menu/:id", sellerController.updateMenu);

router.get("/orders", sellerController.fetchOrders);
router.patch("/orders/:id/status", sellerController.updateOrderStatus);

export default router;