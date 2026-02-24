import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, Heart, MapPin, LogOut, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/integrations/firebase/config";
import { doc, getDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import type { Profile, Order } from "@/integrations/firebase/types";
import { formatINR } from "@/lib/razorpay";

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.uid],
    queryFn: async () => {
      if (!user) return null;
      const snap = await getDoc(doc(db, "profiles", user.uid));
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as Profile;
    },
    enabled: !!user,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["orders", user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const q = query(
        collection(db, "orders"),
        where("user_id", "==", user.uid),
        orderBy("created_at", "desc")
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
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
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-headline text-foreground mb-4">My Account</h1>
            <p className="text-body-lg text-muted-foreground mb-12">
              Welcome back, {profile?.full_name || user.email}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-2"
            >
              <Link
                to="/account"
                className="flex items-center gap-4 p-4 bg-card border border-border text-foreground"
              >
                <User className="w-5 h-5" />
                <span className="text-body">Profile</span>
              </Link>
              <Link
                to="/account/orders"
                className="flex items-center gap-4 p-4 border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
              >
                <Package className="w-5 h-5" />
                <span className="text-body">Orders</span>
              </Link>
              <Link
                to="/account/wishlist"
                className="flex items-center gap-4 p-4 border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span className="text-body">Wishlist</span>
              </Link>
              <Link
                to="/account/addresses"
                className="flex items-center gap-4 p-4 border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
              >
                <MapPin className="w-5 h-5" />
                <span className="text-body">Addresses</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-4 p-4 border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-body">Sign Out</span>
              </button>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="md:col-span-2"
            >
              {/* Profile Section */}
              <div className="bg-card border border-border p-8 mb-8">
                <h2 className="text-subhead text-foreground mb-6">
                  Profile Information
                </h2>
                <div className="grid gap-6">
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      NAME
                    </p>
                    <p className="text-body text-foreground">
                      {profile?.full_name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      EMAIL
                    </p>
                    <p className="text-body text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      PHONE
                    </p>
                    <p className="text-body text-foreground">
                      {profile?.phone || "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-card border border-border p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-subhead text-foreground">
                    Recent Orders
                  </h2>
                  <Link
                    to="/account/orders"
                    className="text-caption text-muted-foreground link-underline"
                  >
                    View All
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-body text-muted-foreground mb-4">
                      No orders yet
                    </p>
                    <Link to="/shop" className="btn-outline">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border border-border"
                      >
                        <div>
                          <p className="text-body text-foreground">
                            Order #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-caption text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-body text-foreground">
                            {formatINR(Number(order.total))}
                          </p>
                          <p className="text-caption text-muted-foreground capitalize">
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Account;
