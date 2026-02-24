import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Loader2, Check, Lock } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/integrations/firebase/config";
import { collection, addDoc, writeBatch, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { initiateRazorpayPayment, formatINR } from "@/lib/razorpay";

const addressSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(10, "Phone is required"),
});

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  const shipping = total > 5000 ? 0 : 199;
  const tax = total * 0.18;
  const grandTotal = total + shipping + tax;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      navigate("/cart");
    }
  }, [items, navigate, orderComplete]);

  const handleAddressChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateAddress = () => {
    const result = addressSchema.safeParse(shippingAddress);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(errors);
      return false;
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateAddress()) {
      setStep(2);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) return;
    
    setLoading(true);

    try {
      // Initiate Razorpay payment
      const paymentResult = await initiateRazorpayPayment({
        amount: Math.round(grandTotal * 100), // Convert to paise
        description: `Depth & Decoy Order — ${items.length} item${items.length > 1 ? "s" : ""}`,
        prefill: {
          name: shippingAddress.fullName,
          email: user.email || "",
          contact: shippingAddress.phone,
        },
      });

      if (!paymentResult.success) {
        toast({
          title: "Payment Cancelled",
          description: paymentResult.error || "Payment was not completed.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Payment successful — create order document
      const orderRef = await addDoc(collection(db, "orders"), {
        user_id: user.uid,
        status: "confirmed",
        subtotal: total,
        shipping_cost: shipping,
        tax: tax,
        total: grandTotal,
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
        payment_status: "paid",
        payment_intent_id: paymentResult.paymentId || null,
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Create order items in a batch
      const batch = writeBatch(db);
      items.forEach((item) => {
        const itemRef = doc(collection(db, "order_items"));
        batch.set(itemRef, {
          order_id: orderRef.id,
          product_id: item.id,
          product_name: item.name,
          product_image: item.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          created_at: new Date().toISOString(),
        });
      });
      await batch.commit();

      setOrderId(orderRef.id);
      setOrderComplete(true);
      clearCart();
    } catch (error: any) {
      console.error("Order error:", error);
      toast({
        title: "Order Failed",
        description: error?.message || "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="pt-40 pb-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (orderComplete) {
    return (
      <Layout>
        <section className="pt-32 pb-20 md:pt-40 min-h-[60vh] flex items-center">
          <div className="container-premium max-w-lg mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-20 h-20 bg-foreground text-background rounded-full flex items-center justify-center mx-auto mb-8">
                <Check className="w-10 h-10" />
              </div>
              <h1 className="text-headline text-foreground mb-4">
                Order Confirmed
              </h1>
              <p className="text-body-lg text-muted-foreground mb-8">
                Thank you for your purchase. Your order #{orderId?.slice(0, 8)} has been placed successfully and payment received.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/account" className="btn-outline">
                  View Order
                </Link>
                <Link to="/shop" className="btn-primary">
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container-premium">
          {/* Back Link */}
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-caption text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Cart
          </Link>

          <h1 className="text-headline text-foreground mb-12">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step Indicator */}
              <div className="flex items-center gap-4 mb-12">
                <div className={`flex items-center gap-2 ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
                  <span className={`w-8 h-8 flex items-center justify-center border ${step >= 1 ? "border-foreground bg-foreground text-background" : "border-border"}`}>
                    1
                  </span>
                  <span className="text-caption hidden sm:block">Shipping</span>
                </div>
                <div className="flex-1 h-px bg-border" />
                <div className={`flex items-center gap-2 ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                  <span className={`w-8 h-8 flex items-center justify-center border ${step >= 2 ? "border-foreground bg-foreground text-background" : "border-border"}`}>
                    2
                  </span>
                  <span className="text-caption hidden sm:block">Payment</span>
                </div>
              </div>

              {/* Step 1: Shipping */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-subhead text-foreground mb-8">
                    Shipping Address
                  </h2>

                  <div className="grid gap-6">
                    <div>
                      <label className="text-caption text-muted-foreground block mb-2">
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => handleAddressChange("fullName", e.target.value)}
                        className="w-full bg-input border border-border px-4 py-3 text-body text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                        placeholder="John Doe"
                      />
                      {fieldErrors.fullName && (
                        <p className="text-destructive text-xs mt-1">{fieldErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-caption text-muted-foreground block mb-2">
                        ADDRESS LINE 1
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.addressLine1}
                        onChange={(e) => handleAddressChange("addressLine1", e.target.value)}
                        className="w-full bg-input border border-border px-4 py-3 text-body text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                        placeholder="123 Main Street"
                      />
                      {fieldErrors.addressLine1 && (
                        <p className="text-destructive text-xs mt-1">{fieldErrors.addressLine1}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-caption text-muted-foreground block mb-2">
                        ADDRESS LINE 2 (OPTIONAL)
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.addressLine2}
                        onChange={(e) => handleAddressChange("addressLine2", e.target.value)}
                        className="w-full bg-input border border-border px-4 py-3 text-body text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                        placeholder="Apartment, suite, etc."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-caption text-muted-foreground block mb-2">
                          CITY
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) => handleAddressChange("city", e.target.value)}
                          className="w-full bg-input border border-border px-4 py-3 text-body text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                          placeholder="Mumbai"
                        />
                        {fieldErrors.city && (
                          <p className="text-destructive text-xs mt-1">{fieldErrors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-caption text-muted-foreground block mb-2">
                          STATE
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.state}
                          onChange={(e) => handleAddressChange("state", e.target.value)}
                          className="w-full bg-input border border-border px-4 py-3 text-body text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                          placeholder="Maharashtra"
                        />
                        {fieldErrors.state && (
                          <p className="text-destructive text-xs mt-1">{fieldErrors.state}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-caption text-muted-foreground block mb-2">
                          POSTAL CODE
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.postalCode}
                          onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                          className="w-full bg-input border border-border px-4 py-3 text-body text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                          placeholder="400001"
                        />
                        {fieldErrors.postalCode && (
                          <p className="text-destructive text-xs mt-1">{fieldErrors.postalCode}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-caption text-muted-foreground block mb-2">
                          COUNTRY
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.country}
                          onChange={(e) => handleAddressChange("country", e.target.value)}
                          className="w-full bg-input border border-border px-4 py-3 text-body text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                          placeholder="India"
                        />
                        {fieldErrors.country && (
                          <p className="text-destructive text-xs mt-1">{fieldErrors.country}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-caption text-muted-foreground block mb-2">
                        PHONE
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleAddressChange("phone", e.target.value)}
                        className="w-full bg-input border border-border px-4 py-3 text-body text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                        placeholder="+91 98765 43210"
                      />
                      {fieldErrors.phone && (
                        <p className="text-destructive text-xs mt-1">{fieldErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleContinueToPayment}
                    className="btn-primary w-full mt-10"
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-subhead text-foreground">Payment</h2>
                    <button
                      onClick={() => setStep(1)}
                      className="text-caption text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Edit Shipping
                    </button>
                  </div>

                  {/* Shipping Summary */}
                  <div className="p-4 border border-border mb-8">
                    <p className="text-caption text-muted-foreground mb-1">
                      SHIPPING TO
                    </p>
                    <p className="text-body text-foreground">
                      {shippingAddress.fullName}
                    </p>
                    <p className="text-body text-muted-foreground">
                      {shippingAddress.addressLine1}
                      {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
                    </p>
                    <p className="text-body text-muted-foreground">
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                    </p>
                  </div>

                  {/* Razorpay Payment */}
                  <div className="p-6 bg-secondary border border-border mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                      <p className="text-caption text-foreground">
                        SECURE PAYMENT
                      </p>
                    </div>
                    <p className="text-body text-muted-foreground">
                      Your payment will be processed securely via Razorpay. We accept
                      UPI, credit/debit cards, net banking, and wallets.
                    </p>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Pay {formatINR(Math.round(grandTotal))}
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card p-8 border border-border lg:sticky lg:top-32">
                <h2 className="text-subhead text-foreground mb-8">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-8 pb-8 border-b border-border">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex gap-4"
                    >
                      <div className="w-16 h-20 bg-secondary flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-body text-foreground">{item.name}</p>
                        <p className="text-caption text-muted-foreground">
                          {item.color} / {item.size} × {item.quantity}
                        </p>
                        <p className="text-body text-foreground mt-1">
                          {formatINR(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between text-body">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">
                      {formatINR(total)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-body">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {shipping === 0 ? "Free" : formatINR(shipping)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-body">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="text-foreground">
                      {formatINR(Math.round(tax))}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-body text-foreground">Total</span>
                    <span className="text-xl font-display tracking-wider text-foreground">
                      {formatINR(Math.round(grandTotal))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
