import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { useProducts, useCategories } from "@/hooks/useProducts";

const seriesData = [
  {
    name: "Quote Series",
    slug: "quote-series",
    tagline: "Wear what you believe",
    description:
      "Statement pieces that carry conviction. Every garment in the Quote Series bears the ethos of Depth & Decoy — words that move, printed on fabric that lasts.",
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=900&h=1100&fit=crop&q=80",
  },
  {
    name: "Chronicle Series",
    slug: "chronicle-series",
    tagline: "Every thread tells a story",
    description:
      "Narrative-driven designs that chronicle the journey. The Chronicle Series captures moments in time through texture, tone, and meticulous construction.",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&h=1100&fit=crop&q=80",
  },
];

const Collections = () => {
  const [searchParams] = useSearchParams();
  const activeSeries = searchParams.get("series");

  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts();

  // When a series is selected, show its products (for now show all — filter logic can be refined per your DB)
  const activeMeta = activeSeries
    ? seriesData.find((s) => s.slug === activeSeries)
    : null;

  // Category-based images for fallback cards
  const categoryImages: Record<string, string> = {
    jackets:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop&q=80",
    trousers:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=1000&fit=crop&q=80",
    tops:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=80",
    accessories:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop&q=80",
  };

  return (
    <Layout>
      <section className="pt-32 pb-20 md:pt-40" aria-label="Collections">
        <div className="container-premium">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14 md:mb-20"
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
              {activeMeta ? activeMeta.tagline : "Explore"}
            </p>
            <h1 className="text-headline text-foreground">
              {activeMeta ? activeMeta.name : "The Series"}
            </h1>
            <p className="mt-5 text-lg font-light text-muted-foreground max-w-lg mx-auto">
              {activeMeta
                ? activeMeta.description
                : "Each series tells its own story. Explore the collections that define Depth & Decoy."}
            </p>
          </motion.div>

          {/* If a specific series is active, show its products */}
          {activeMeta ? (
            <>
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-secondary mb-4" />
                      <div className="h-3 bg-secondary w-3/4 mb-2" />
                      <div className="h-3 bg-secondary w-1/4" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                  {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}

              <div className="mt-14 text-center">
                <Link to="/collections" className="btn-outline">
                  ← All Series
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Series Cards */}
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-20 md:mb-28">
                {seriesData.map((s, index) => (
                  <motion.div
                    key={s.slug}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: index * 0.12 }}
                  >
                    <Link
                      to={`/collections?series=${s.slug}`}
                      className="group block relative aspect-[4/5] bg-secondary overflow-hidden"
                    >
                      <img
                        src={s.image}
                        alt={s.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                        <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
                          {s.tagline}
                        </p>
                        <h2 className="font-display text-3xl md:text-4xl tracking-[0.05em] text-foreground mb-3">
                          {s.name}
                        </h2>
                        <p className="text-sm font-light text-muted-foreground mb-5 max-w-xs">
                          {s.description}
                        </p>
                        <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-foreground group-hover:gap-3 transition-all duration-300">
                          Explore <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Shop by Category */}
              <div className="text-center mb-10 md:mb-14">
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                  Shop By
                </p>
                <h2 className="text-subhead text-foreground">Category</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {categories.map((cat, index) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
                    <Link
                      to={`/shop?category=${cat.slug}`}
                      className="group block relative aspect-square bg-secondary overflow-hidden"
                    >
                      <img
                        src={
                          categoryImages[cat.slug] ||
                          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=600&fit=crop&q=80"
                        }
                        alt={cat.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-background/50 group-hover:bg-background/40 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="font-display text-lg md:text-xl tracking-[0.1em] text-foreground">
                          {cat.name}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Collections;
