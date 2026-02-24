import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ChevronLeft, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/integrations/firebase/config";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import type { Order, OrderItem } from "@/integrations/firebase/types";
import { formatINR } from "@/lib/razorpay";

type OrderWithItems = Order & { order_items?: OrderItem[] };

const AccountOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.uid],
    queryFn: async (): Promise<OrderWithItems[]> => {
      if (!user) return [];

      // Fetch orders
      const ordersQuery = query(
        collection(db, "orders"),
        where("user_id", "==", user.uid),
        orderBy("created_at", "desc")
      );
      const ordersSnap = await getDocs(ordersQuery);
      const ordersData = ordersSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Order
      );

      // Fetch order items for each order
      const results: OrderWithItems[] = await Promise.all(
        ordersData.map(async (order) => {
          const itemsQuery = query(
            collection(db, "order_items"),
            where("order_id", "==", order.id)
          );
          const itemsSnap = await getDocs(itemsQuery);
          const items = itemsSnap.docs.map(
            (d) => ({ id: d.id, ...d.data() }) as OrderItem
          );
          return { ...order, order_items: items };
        })
      );

      return results;
    },
    enabled: !!user,
  });

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="pt-40 pb-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container-premium">
          <Link
            to="/account"
            className="inline-flex items-center gap-2 text-caption text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Account
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-headline text-foreground mb-4">Order History</h1>
            <p className="text-body-lg text-muted-foreground mb-12">
              View and track all your orders.
            </p>
          </motion.div>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center py-20"
            >
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-subhead text-foreground mb-4">No Orders Yet</h2>
              <p className="text-body text-muted-foreground mb-8">
                Start shopping to see your orders here.
              </p>
              <Link to="/shop" className="btn-primary">
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border p-6 md:p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="text-caption text-muted-foreground mb-1">
                        ORDER #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-body text-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 text-xs tracking-wider uppercase ${
                        order.status === "completed" 
                          ? "bg-accent/20 text-foreground" 
                          : order.status === "processing"
                          ? "bg-secondary text-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-body font-medium text-foreground">
                        {formatINR(Number(order.total))}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <div className="flex flex-wrap gap-4">
                      {order.order_items?.slice(0, 4).map((item: any) => (
                        <div
                          key={item.id}
                          className="w-16 h-20 bg-secondary overflow-hidden"
                        >
                          {item.product_image && (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                      {order.order_items && order.order_items.length > 4 && (
                        <div className="w-16 h-20 bg-secondary flex items-center justify-center">
                          <span className="text-caption text-muted-foreground">
                            +{order.order_items.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AccountOrders;
