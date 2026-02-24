/**
 * Razorpay payment integration for Depth & Decoy.
 *
 * Usage:
 *   1. Set VITE_RAZORPAY_KEY_ID in your .env file
 *   2. Load the Razorpay script in index.html:
 *      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
 *   3. Call initiateRazorpayPayment() from your checkout flow
 */

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayPaymentOptions {
  /** Amount in paise (INR × 100) */
  amount: number;
  /** Order description shown to user */
  description?: string;
  /** Prefill customer details */
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  /** Internal order/reference ID */
  orderId?: string;
}

export interface RazorpayPaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

/**
 * Opens the Razorpay checkout modal and resolves with the payment result.
 */
export const initiateRazorpayPayment = (
  options: RazorpayPaymentOptions
): Promise<RazorpayPaymentResult> => {
  return new Promise((resolve) => {
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!keyId) {
      resolve({
        success: false,
        error: "Razorpay key not configured. Please set VITE_RAZORPAY_KEY_ID in your .env file.",
      });
      return;
    }

    if (typeof window.Razorpay === "undefined") {
      resolve({
        success: false,
        error: "Razorpay SDK not loaded. Please check your internet connection and try again.",
      });
      return;
    }

    const razorpayOptions = {
      key: keyId,
      amount: options.amount, // amount in paise
      currency: "INR",
      name: "Depth & Decoy",
      description: options.description || "Premium Menswear",
      image: "/DepthnDecoy.jpg",
      prefill: {
        name: options.prefill?.name || "",
        email: options.prefill?.email || "",
        contact: options.prefill?.contact || "",
      },
      notes: {
        order_id: options.orderId || "",
      },
      theme: {
        color: "#0a0a0a",
        backdrop_color: "rgba(0,0,0,0.7)",
      },
      modal: {
        ondismiss: () => {
          resolve({ success: false, error: "Payment cancelled by user." });
        },
      },
      handler: (response: any) => {
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
        });
      },
    };

    try {
      const rzp = new window.Razorpay(razorpayOptions);
      rzp.on("payment.failed", (response: any) => {
        resolve({
          success: false,
          error:
            response.error?.description ||
            "Payment failed. Please try again.",
        });
      });
      rzp.open();
    } catch (err: any) {
      resolve({
        success: false,
        error: err?.message || "Failed to initialize payment gateway.",
      });
    }
  });
};

/**
 * Formats a number as Indian Rupees.
 * e.g. formatINR(12999) => "₹12,999"
 */
export const formatINR = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN")}`;
};
