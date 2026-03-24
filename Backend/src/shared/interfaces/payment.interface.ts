export type PaymentMethod = "stripe" | "razorpay";

export interface CreatePaymentIntentInput {
  orderId: string;
  method: PaymentMethod;
}

export interface PaymentIntentResponse {
  id: string;
  clientSecret?: string;        // for Stripe
  razorpayOrderId?: string;     // for Razorpay
  amount: number;
  currency: string;
}

export interface VerifyPaymentInput {
  orderId: string;
  paymentId: string;
  method: PaymentMethod;
  signature?: string; // required for Razorpay
}

export interface PaymentVerificationResponse {
  verified: boolean;
}