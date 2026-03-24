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
  | "REFUNDED";

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  customer: CustomerDetails;

  subtotal: number;
  tax: number;
  total: number;

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  sellerId?: string; // important for seller filtering
  createdAt: Date;
  updatedAt: Date;
}