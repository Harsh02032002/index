import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "ADMIN" | "SELLER" | "CUSTOMER";
export type UserStatus = "active" | "blocked" | "SUSPENDED";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  profileImage?: string;   // ✅ ADD THIS
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["ADMIN", "SELLER", "CUSTOMER"],
      default: "CUSTOMER",
    },

    status: {
      type: String,
      enum: ["active", "SUSPENDED","blocked"],
      default: "active",
    },

    profileImage: {
      type: String,
      default: null,   // ✅ Better practice
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);