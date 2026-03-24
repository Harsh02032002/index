import crypto from "crypto";
import mongoose from "mongoose";
import Order from "../order/order.model";
import Payment from "./payment.model";
import { razorpay } from "../../config/razorpay";
import { AppError } from "../../shared/middlewares/error.middleware";
import { env } from "../../config/env";

type PaymentMethod = "razorpay" | "cash";

export const createPaymentIntent = async (
  orderId: string,
  method: PaymentMethod
) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.paymentStatus === "SUCCESS") {
    throw new AppError("Order already paid", 400);
  }

  // ✅ CASH ON DELIVERY
  if (method === "cash") {
    const payment = await Payment.create({
      orderId: order._id,
      amount: order.total,
      currency: "INR",
      method: "cash",
      status: "CREATED",
    });

    return {
      id: payment._id,
      orderId: order._id,
      amount: order.total,
      currency: "INR",
      method: "cash",
    };
  }

  // ❌ Unsupported method
  if (method !== "razorpay") {
    throw new AppError("Unsupported payment method", 400);
  }

  // ✅ Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.total * 100), // convert to paisa
    currency: "INR",
    receipt: order._id.toString(),
  });

  // ✅ Create Payment document in DB
  const payment = await Payment.create({
    orderId: order._id,
    amount: order.total,
    currency: "INR",
    method: "razorpay",
    status: "CREATED",
    paymentGatewayId: razorpayOrder.id,
  });

  return {
    id: payment._id,
    orderId: order._id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    method: "razorpay",
  };
};

export const verifyPayment = async (data: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      orderId,
      paymentId,
      razorpay_payment_id,
      razorpay_signature,
    } = data;

    if (!orderId || !paymentId) {
      throw new AppError("orderId and paymentId are required", 400);
    }

    const order = await Order.findById(orderId).session(session);
    if (!order) throw new AppError("Order not found", 404);

    const payment = await Payment.findById(paymentId).session(session);
    if (!payment) throw new AppError("Payment record not found", 404);

    // ✅ Razorpay Verification
    if (payment.method === "razorpay") {
      if (!razorpay_payment_id || !razorpay_signature) {
        throw new AppError("Razorpay payment data missing", 400);
      }

      const body = payment.paymentGatewayId + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        throw new AppError("Invalid Razorpay signature", 400);
      }

      payment.paymentId = razorpay_payment_id;
      payment.signature = razorpay_signature;
      payment.status = "SUCCESS";
    }

    // ✅ Cash on Delivery auto success
    if (payment.method === "cash") {
      payment.status = "SUCCESS";
    }

    await payment.save({ session });

    order.paymentStatus = "SUCCESS";
    order.paymentRef = payment._id;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { verified: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};