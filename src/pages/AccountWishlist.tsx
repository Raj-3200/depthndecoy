import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ChevronLeft, Loader2, X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/integrations/firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import type { WishlistItem, Product } from "@/integrations/firebase/types";

const AccountWishlist = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const q = query(
        collection(db, "wishlist"),
        where("user_id", "==", user.uid),
        orderBy("created_at", "desc")
      );
      const snap = await getDocs(q);
      const items = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as WishlistItem
      );

      // Attach product data
      const withProducts = await Promise.all(
        items.map(async (item) => {
          const productSnap = await getDoc(doc(db, "products", item.product_id));
          if (productSnap.exists()) {
            item.product = { id: productSnap.id, ...productSnap.data() } as Product;
          }
          return item;
        })
      );

      return withProducts;
    },
    enabled: !!user,
  });

  const removeFromWishlist = useMutation({
    mutationFn: async (wishlistId: string) => {
      await deleteDoc(doc(db, "wishlist", wishlistId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      });
    },
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
            <h1 className="text-headline text-foreground mb-4">Wishlist</h1>
            <p className="text-body-lg text-muted-foreground mb-12">
              Items you've saved for later.
            </p>
          </motion.div>

          {wishlistItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center py-20"
            >
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-subhead text-foreground mb-4">Your Wishlist is Empty</h2>
              <p className="text-body text-muted-foreground mb-8">
                Save items you love to your wishlist.
              </p>
              <Link to="/shop" className="btn-primary">
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-4">
                    <Link to={`/product/${item.product?.slug}`}>
                      <img
                        src={item.product?.images?.[0] || "/placeholder.svg"}
                        alt={item.product?.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                    <button
                      onClick={() => removeFromWishlist.mutate(item.id)}
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-background/80 text-foreground hover:bg-foreground hover:text-background transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <Link to={`/product/${item.product?.slug}`}>
                    <h3 className="font-display text-lg tracking-[0.05em] text-foreground group-hover:text-muted-foreground transition-colors">
                      {item.product?.name}
                    </h3>
                    <p className="text-body text-muted-foreground mt-1">
                      ${Number(item.product?.price).toLocaleString()}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AccountWishlist;
