import mongoose, { Schema, Document } from "mongoose";

export interface IMenu extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sellerId: mongoose.Types.ObjectId;
  isActive: boolean;
}

const menuSchema = new Schema<IMenu>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMenu>("Menu", menuSchema);