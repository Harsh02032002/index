import { Router } from "express";
import * as paymentController from "./payment.controller";
import { authenticate } from "../../shared/middlewares/auth.middleware";

const router = Router();

router.post(
  "/create-intent",
  authenticate,
  paymentController.createPaymentIntent
);

router.post(
  "/verify",
  authenticate,
  paymentController.verifyPayment
);

export default router;