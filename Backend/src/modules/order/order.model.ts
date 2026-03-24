import mongoose, { Schema, Document } from "mongoose";

export type OrderStatus =
  | "ORDER_RECEIVED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED"
  | "processing";

export interface IOrder extends Document {
  items: {
    menuItemId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
  }[];

  customer: {
    name: string;
    phone: string;
    address: string;
  };

  subtotal: number;
  tax: number;
  total: number;

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  sellerId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // 🔥 User who placed order
  paymentRef?: mongoose.Types.ObjectId;
}

const orderSchema = new Schema<IOrder>(
  {
    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String }, // Optional field for menu item image
      },
    ],

    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },

    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        "ORDER_RECEIVED",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "ORDER_RECEIVED",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED","processing"],
      default: "PENDING",
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paymentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);