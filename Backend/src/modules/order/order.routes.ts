import { Router } from "express";
import * as orderController from "./order.controller";
import {
  authenticate,
  authorize,
} from "../../shared/middlewares/auth.middleware";

const router = Router();

/*
|--------------------------------------------------------------------------
| CREATE ORDER (User)
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  authenticate,
  orderController.createOrder
);

/*
|--------------------------------------------------------------------------
| SELLER ROUTES (STATIC FIRST)
|--------------------------------------------------------------------------
*/

// Seller → Apne orders dekhe
router.get(
  "/seller",
  authenticate,
  authorize("SELLER"),
  orderController.fetchSellerOrders
);

/*
|--------------------------------------------------------------------------
| USER ROUTES (STATIC)
|--------------------------------------------------------------------------
*/

// User → Apne orders dekhe
router.get(
  "/my",
  authenticate,
  orderController.fetchMyOrders
);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES (STATIC)
|--------------------------------------------------------------------------
*/

// Admin → All Orders
router.get(
  "/admin/all",
  authenticate,
  authorize("ADMIN"),
  orderController.fetchAllOrders
);

/*
|--------------------------------------------------------------------------
| UPDATE ORDER STATUS (Admin + Seller)
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN", "SELLER"),
  orderController.updateOrderStatus
);

/*
|--------------------------------------------------------------------------
| SINGLE ORDER (DYNAMIC ROUTE MUST BE LAST)
|--------------------------------------------------------------------------
*/
router.get(
  "/:id",
  authenticate,
  orderController.fetchOrder
);

export default router;