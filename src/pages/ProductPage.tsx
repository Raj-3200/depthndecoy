import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Minus, Check } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { useProduct, useRelatedProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatINR } from "@/lib/razorpay";

/**
 * Attempt to map images to colors by naming convention.
 * If images contain the color name (e.g. "black-front.jpg"), we group.
 * Otherwise, all images are shared across every color.
 */
function groupImagesByColor(
  images: string[] | null,
  colors: string[] | null
): Record<string, string[]> {
  if (!images || images.length === 0) return {};
  if (!colors || colors.length === 0) return { default: images };

  const grouped: Record<string, string[]> = {};
  for (const color of colors) {
    const key = color.toLowerCase().replace(/\s+/g, "-");
    const matched = images.filter((img) =>
      img.toLowerCase().includes(key)
    );
    grouped[color] = matched.length > 0 ? matched : images;
  }
  return grouped;
}

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || "");
  const { data: relatedProducts = [] } = useRelatedProducts(
    product?.id || "",
    product?.category_id || null
  );
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  // Set default color when product loads
  useEffect(() => {
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
  }, [product, selectedColor]);

  // Image grouping by color
  const imagesByColor = useMemo(
    () => groupImagesByColor(product?.images ?? null, product?.colors ?? null),
    [product?.images, product?.colors]
  );

  const currentImages = useMemo(() => {
    if (!product?.images || product.images.length === 0) return ["/placeholder.svg"];
    if (selectedColor && imagesByColor[selectedColor]) return imagesByColor[selectedColor];
    return product.images;
  }, [selectedColor, imagesByColor, product?.images]);

  // Reset active image when color changes
  useEffect(() => {
    setActiveImage(0);
  }, [selectedColor]);

  // Reset state when product changes
  useEffect(() => {
    setSelectedSize(null);
    setSelectedColor(null);
    setQuantity(1);
    setActiveImage(0);
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-32 pb-20 md:pt-40">
          <div className="container-premium">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="animate-pulse">
                <div className="aspect-[3/4] bg-secondary mb-4" />
                <div className="flex gap-3">
                  <div className="w-16 h-20 bg-secondary" />
                  <div className="w-16 h-20 bg-secondary" />
                  <div className="w-16 h-20 bg-secondary" />
                </div>
              </div>
              <div className="animate-pulse">
                <div className="h-3 bg-secondary w-1/4 mb-4" />
                <div className="h-8 bg-secondary w-3/4 mb-4" />
                <div className="h-5 bg-secondary w-1/4 mb-8" />
                <div className="h-16 bg-secondary w-full mb-10" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="pt-40 pb-20 text-center">
          <h1 className="text-headline text-foreground mb-6">
            Product Not Found
          </h1>
          <Link to="/shop" className="btn-outline">
            Back to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) return;

    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: currentImages[0] || "/placeholder.svg",
      size: selectedSize,
      color: selectedColor || product.colors?.[0] || "",
      quantity,
    });

    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="pt-28 md:pt-32 pb-6">
        <div className="container-premium">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Shop
          </Link>
        </div>
      </div>

      {/* Product */}
      <section className="pb-20" aria-label={product.name}>
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Main Image */}
              <div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-3">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${selectedColor}-${activeImage}`}
                    src={currentImages[activeImage] || "/placeholder.svg"}
                    alt={`${product.name}${selectedColor ? ` in ${selectedColor}` : ""}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                {product.is_new && (
                  <span className="absolute top-4 left-4 text-[9px] tracking-[0.2em] uppercase bg-foreground text-background px-3 py-1">
                    New
                  </span>
                )}
                {!product.in_stock && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Sold Out</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {currentImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {currentImages.map((img, index) => (
                    <button
                      key={`${selectedColor}-${index}`}
                      onClick={() => setActiveImage(index)}
                      className={`relative flex-shrink-0 w-16 h-20 overflow-hidden border transition-all ${
                        activeImage === index
                          ? "border-foreground opacity-100"
                          : "border-transparent opacity-50 hover:opacity-75"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="lg:sticky lg:top-28">
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                  {product.category?.name?.toUpperCase() || "PRODUCT"}
                </p>
                <h1 className="font-display text-3xl md:text-4xl tracking-[0.04em] text-foreground mb-3">
                  {product.name}
                </h1>
                <p className="text-xl font-light text-foreground mb-6">
                  {formatINR(Number(product.price))}
                </p>

                <p className="text-sm font-light text-muted-foreground leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Color Selection */}
                {product.colors && product.colors.length > 1 && (
                  <div className="mb-7">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
                      Color — <span className="text-foreground">{selectedColor || product.colors[0]}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 text-[10px] tracking-[0.12em] uppercase border transition-colors ${
                            (selectedColor || product.colors?.[0]) === color
                              ? "border-foreground text-foreground bg-foreground/10"
                              : "border-border text-muted-foreground hover:border-muted-foreground"
                          }`}
                          aria-pressed={(selectedColor || product.colors?.[0]) === color}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                <div className="mb-7">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                      Size {selectedSize && <span className="text-foreground">— {selectedSize}</span>}
                    </p>
                    <Link
                      to="/about#size-guide"
                      className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                    >
                      Size Guide
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes?.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[2.75rem] px-3 py-2.5 text-[10px] tracking-[0.12em] uppercase border transition-colors ${
                          selectedSize === size
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:border-muted-foreground"
                        }`}
                        aria-pressed={selectedSize === size}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {!selectedSize && (
                    <p className="mt-2 text-[10px] text-muted-foreground/60">
                      Please select a size to add to cart
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="mb-8">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
                    Quantity
                  </p>
                  <div className="inline-flex items-center border border-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm text-foreground">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !product.in_stock}
                  className={`w-full btn-primary relative overflow-hidden ${
                    !selectedSize || !product.in_stock ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {showAddedMessage ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Added to Cart
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                      >
                        {!product.in_stock
                          ? "Sold Out"
                          : selectedSize
                          ? "Add to Cart"
                          : "Select a Size"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                {/* Accordion Details */}
                <div className="mt-10 border-t border-border">
                  <Accordion type="single" collapsible defaultValue="details">
                    <AccordionItem value="details" className="border-border">
                      <AccordionTrigger className="text-[10px] tracking-[0.2em] uppercase text-foreground hover:no-underline py-5">
                        Product Details
                      </AccordionTrigger>
                      <AccordionContent className="pb-5">
                        <ul className="space-y-1.5">
                          {product.details?.map((detail, index) => (
                            <li key={index} className="text-sm font-light text-muted-foreground">
                              • {detail}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="shipping" className="border-border">
                      <AccordionTrigger className="text-[10px] tracking-[0.2em] uppercase text-foreground hover:no-underline py-5">
                        Shipping & Returns
                      </AccordionTrigger>
                      <AccordionContent className="pb-5">
                        <div className="space-y-3 text-sm font-light text-muted-foreground">
                          <p>Free shipping across India on orders over ₹5,000. Standard delivery 3–7 business days.</p>
                          <p>Returns accepted within 14 days of delivery. Items must be unworn with tags attached.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 md:py-24 border-t border-border" aria-label="Related products">
          <div className="container-premium">
            <h2 className="text-subhead text-foreground mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductPage;
