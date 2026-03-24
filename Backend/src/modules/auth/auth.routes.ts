import { Router } from "express";
import * as authController from "./auth.controller";
import { authenticate } from "../../shared/middlewares/auth.middleware";
import { validate } from "../../shared/middlewares/validate.middleware";
import { registerSchema, loginSchema } from "./auth.validator";
import { upload } from "../../shared/middlewares/upload.middleware";
const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  authController.register
);

router.post(
  "/login",
  validate(loginSchema),
  authController.login
);

router.get("/me", authenticate, authController.getMe);
router.patch(
  "/profile-image",
  authenticate,
  upload.single("image"),
  authController.updateProfileImage
);
router.patch('/profile', authenticate, authController.updateProfile);


export default router;