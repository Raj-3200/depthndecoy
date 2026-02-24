import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const priceRanges = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-100", label: "Under $100", min: 0, max: 100 },
  { id: "100-250", label: "$100 – $250", min: 100, max: 250 },
  { id: "250-500", label: "$250 – $500", min: 250, max: 500 },
  { id: "over-500", label: "Over $500", min: 500, max: Infinity },
];

const sizes = ["S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "One Size"];
const colors = ["Black", "Charcoal", "Smoke Grey", "Ivory", "White"];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl || "all");
  const [selectedPrice, setSelectedPrice] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [showFilters, setShowFilters] = useState(false);

  // Sync category from URL
  useEffect(() => {
    if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const { data: products = [], isLoading } = useProducts({ category: selectedCategory });
  const { data: categories = [] } = useCategories();

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const priceRange = priceRanges.find((r) => r.id === selectedPrice);
    if (priceRange && priceRange.id !== "all") {
      result = result.filter(
        (p) => Number(p.price) >= priceRange.min && Number(p.price) < priceRange.max
      );
    }

    if (selectedSize) {
      result = result.filter((p) => p.sizes?.includes(selectedSize));
    }

    if (selectedColor) {
      result = result.filter((p) => p.colors?.includes(selectedColor));
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "newest":
        result = result.filter((p) => p.is_new).concat(result.filter((p) => !p.is_new));
        break;
      case "featured":
      default:
        result = result.filter((p) => p.featured).concat(result.filter((p) => !p.featured));
        break;
    }

    return result;
  }, [products, selectedPrice, selectedSize, selectedColor, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedPrice !== "all" ? 1 : 0) +
    (selectedSize ? 1 : 0) +
    (selectedColor ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedPrice("all");
    setSelectedSize(null);
    setSelectedColor(null);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-headline text-foreground mb-4">Shop</h1>
            <p className="text-lg font-light text-muted-foreground max-w-xl">
              Explore the full collection. Every piece designed for those who
              understand depth over noise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="border-y border-border sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-sm">
        <div className="container-premium">
          <div className="flex items-center justify-between py-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2.5 text-[10px] tracking-[0.15em] uppercase text-foreground hover:text-muted-foreground transition-colors"
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 flex items-center justify-center bg-foreground text-background text-[9px] rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Category tabs (desktop) */}
            <div className="hidden lg:flex items-center gap-6">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`text-[10px] tracking-[0.15em] uppercase transition-colors ${
                  selectedCategory === "all"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`text-[10px] tracking-[0.15em] uppercase transition-colors ${
                    selectedCategory === cat.slug
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-5">
              <span className="hidden md:block text-[10px] tracking-[0.1em] uppercase text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent text-[10px] tracking-[0.1em] uppercase text-foreground pr-5 cursor-pointer focus:outline-none"
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-border"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6">
                  {/* Category (Mobile) */}
                  <div className="lg:hidden">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-3">
                      Category
                    </p>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={`text-left text-sm font-light ${
                          selectedCategory === "all" ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        All
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.slug)}
                          className={`text-left text-sm font-light ${
                            selectedCategory === cat.slug ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-3">
                      Price
                    </p>
                    <div className="flex flex-col gap-2">
                      {priceRanges.map((range) => (
                        <button
                          key={range.id}
                          onClick={() => setSelectedPrice(range.id)}
                          className={`text-left text-sm font-light ${
                            selectedPrice === range.id ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-3">
                      Size
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                          className={`px-2.5 py-1.5 text-[10px] tracking-[0.08em] border transition-colors ${
                            selectedSize === size
                              ? "border-foreground text-foreground"
                              : "border-border text-muted-foreground hover:border-muted-foreground"
                          }`}
                          aria-pressed={selectedSize === size}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-3">
                      Color
                    </p>
                    <div className="flex flex-col gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                          className={`text-left text-sm font-light ${
                            selectedColor === color ? "text-foreground" : "text-muted-foreground"
                          }`}
                          aria-pressed={selectedColor === color}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mb-4 flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear All Filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-10 md:py-16">
        <div className="container-premium">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-secondary mb-4" />
                  <div className="h-3 bg-secondary w-3/4 mb-2" />
                  <div className="h-3 bg-secondary w-1/4" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg font-light text-muted-foreground mb-4">
                No products match your filters.
              </p>
              <button
                onClick={clearFilters}
                className="text-[11px] tracking-[0.15em] uppercase text-foreground hover:text-muted-foreground transition-colors underline underline-offset-4"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
