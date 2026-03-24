import mongoose, { Schema, Document } from "mongoose";

export type PaymentMethod = "stripe" | "razorpay";

export type PaymentStatus =
  | "CREATED"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;

  paymentGatewayId?: string; // Stripe PI or Razorpay orderId
  paymentId?: string;        // Stripe charge id / Razorpay payment id
  signature?: string;        // Razorpay signature

  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    method: {
      type: String,
      enum: ["stripe", "razorpay","cash"],
      required: true,
    },

    status: {
      type: String,
      enum: ["CREATED", "SUCCESS", "FAILED", "REFUNDED","processing"],
      default: "CREATED",
    },

    paymentGatewayId: String,
    paymentId: String,
    signature: String,
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", paymentSchema);