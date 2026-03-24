import { Router } from "express";
import * as menuController from "./menu.controller";
import { authenticate, authorize } from "../../shared/middlewares/auth.middleware";
import { upload } from "../../shared/middlewares/upload.middleware";
const router = Router();

// Public
router.get("/", menuController.fetchPublicMenu);

// Seller
router.get(
  "/seller",
  authenticate,
  authorize("SELLER"),
  menuController.fetchSellerMenu
);

router.post(
  "/seller",
  authenticate,
  authorize("SELLER"),
  upload.single("image"),
  menuController.createMenu
);
router.put(
  "/seller/:id",
  authenticate,
  authorize("SELLER"),
  menuController.updateMenu
);

// Admin
router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  menuController.fetchAllMenu
);

router.delete(
  "/admin/:id",
  authenticate,
  authorize("ADMIN"),
  menuController.deleteMenu
);
router.delete(
  "/seller/:id",
  authenticate,
  authorize("SELLER"),
  menuController.deleteMenu
);

export default router;