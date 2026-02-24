import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Product } from "@/hooks/useProducts";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/product/${product.slug}`} className="group block">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-4">
          <img
            src={product.images?.[0] || "/placeholder.svg"}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
            loading="lazy"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-500" />

          {/* Labels */}
          {(product.is_new || !product.in_stock) && (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.is_new && (
                <span className="text-[9px] tracking-[0.2em] uppercase bg-foreground text-background px-2.5 py-0.5">
                  New
                </span>
              )}
              {!product.in_stock && (
                <span className="text-[9px] tracking-[0.2em] uppercase bg-muted text-muted-foreground px-2.5 py-0.5">
                  Sold Out
                </span>
              )}
            </div>
          )}

          {/* Quick View on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            <span className="text-[10px] tracking-[0.15em] uppercase text-foreground bg-background/90 px-5 py-2.5">
              View
            </span>
          </div>
        </div>

        {/* Info */}
        <div>
          <h3 className="font-display text-base tracking-[0.04em] text-foreground group-hover:text-muted-foreground transition-colors duration-300 mb-1">
            {product.name}
          </h3>
          <p className="text-sm font-light text-muted-foreground">
            ${Number(product.price).toLocaleString()}
          </p>
        </div>

        {/* Colors */}
        {product.colors && product.colors.length > 1 && (
          <div className="flex gap-1.5 mt-2">
            {product.colors.slice(0, 3).map((color) => (
              <span
                key={color}
                className="text-[9px] tracking-[0.08em] uppercase text-muted-foreground/70"
              >
                {color}
              </span>
            ))}
            {product.colors.length > 3 && (
              <span className="text-[9px] tracking-[0.08em] uppercase text-muted-foreground/70">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  );
};

export default ProductCard;
