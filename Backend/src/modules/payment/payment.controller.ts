import { Request, Response, NextFunction } from "express";
import * as paymentService from "./payment.service";

export const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId, method } = req.body;

    if (!orderId || !method) {
      return res.status(400).json({
        success: false,
        message: "orderId and method are required",
      });
    }

    const intent = await paymentService.createPaymentIntent(
      orderId,
      method
    );

    res.json({ success: true, data: intent });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await paymentService.verifyPayment(req.body);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};