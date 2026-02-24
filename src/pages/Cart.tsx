import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { formatINR } from "@/lib/razorpay";

const Cart = () => {
  const { items, removeItem, updateQuantity, total } = useCart();

  const shipping = total > 5000 ? 0 : 199;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <Layout>
        <section className="pt-40 pb-20">
          <div className="container-premium text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-8" />
              <h1 className="text-headline text-foreground mb-6">
                Your Cart is Empty
              </h1>
              <p className="text-body-lg text-muted-foreground mb-12 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Explore
                the collection and find something you love.
              </p>
              <Link to="/shop" className="btn-primary">
                Continue Shopping
                <ArrowRight className="ml-3 w-4 h-4" />
              </Link>
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
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-headline text-foreground mb-12"
          >
            Your Cart
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="border-t border-border">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-border py-8"
                    >
                      <div className="flex gap-6">
                        {/* Image */}
                        <Link
                          to={`/product/${item.id}`}
                          className="w-24 md:w-32 aspect-[3/4] bg-secondary flex-shrink-0 img-zoom"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <Link
                                to={`/product/${item.id}`}
                                className="font-display text-lg tracking-[0.05em] text-foreground hover:text-muted-foreground transition-colors"
                              >
                                {item.name}
                              </Link>
                              <p className="text-body text-muted-foreground mt-1">
                                {item.color} / {item.size}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id, item.size)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="mt-auto flex items-center justify-between">
                            {/* Quantity */}
                            <div className="inline-flex items-center border border-border">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.size,
                                    item.quantity - 1
                                  )
                                }
                                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-10 text-center text-body text-foreground">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.size,
                                    item.quantity + 1
                                  )
                                }
                                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <p className="text-body text-foreground">
                              {formatINR(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Continue Shopping */}
              <div className="mt-8">
                <Link
                  to="/shop"
                  className="text-caption text-muted-foreground link-underline inline-flex items-center gap-2"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-card p-8 border border-border lg:sticky lg:top-32"
              >
                <h2 className="text-subhead text-foreground mb-8">
                  Order Summary
                </h2>

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
                  {shipping > 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      Free shipping on orders over ₹5,000
                    </p>
                  )}
                </div>

                <div className="border-t border-border pt-6 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-body text-foreground">Total</span>
                    <span className="text-xl font-display tracking-wider text-foreground">
                      {formatINR(grandTotal)}
                    </span>
                  </div>
                </div>

                <Link to="/checkout" className="btn-primary w-full text-center">
                  Proceed to Checkout
                </Link>

                <div className="mt-6 space-y-3">
                  <p className="text-[11px] text-muted-foreground text-center">
                    Secure checkout powered by Razorpay
                  </p>
                  <p className="text-[11px] text-muted-foreground text-center">
                    Free returns within 14 days
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
