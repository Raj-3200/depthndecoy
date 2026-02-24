import { useQuery } from "@tanstack/react-query";
import type { Product, Category } from "@/integrations/firebase/types";
import { localProducts, localCategories } from "@/data/products";

export type { Product, Category };

// ---- All product data is served locally — no Firestore needed ----

export const useProducts = (filters?: {
  category?: string;
  featured?: boolean;
  isNew?: boolean;
}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      let results = localProducts.filter((p) => p.in_stock);

      if (filters?.category && filters.category !== "all") {
        const cat = localCategories.find((c) => c.slug === filters.category);
        if (!cat) return [] as Product[];
        results = results.filter((p) => p.category_id === cat.id);
      }

      if (filters?.featured) {
        results = results.filter((p) => p.featured);
      }

      if (filters?.isNew) {
        results = results.filter((p) => p.is_new);
      }

      return results;
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const product = localProducts.find((p) => p.slug === slug);
      if (!product) throw new Error("Product not found");
      return product;
    },
    enabled: !!slug,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () =>
      localProducts.filter((p) => p.featured && p.in_stock),
  });
};

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ["products", "new"],
    queryFn: async () =>
      localProducts.filter((p) => p.is_new && p.in_stock),
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      [...localCategories].sort((a, b) => a.name.localeCompare(b.name)),
  });
};

export const useRelatedProducts = (
  productId: string,
  categoryId: string | null
) => {
  return useQuery({
    queryKey: ["products", "related", productId],
    queryFn: async () => {
      if (!categoryId) return [];
      return localProducts
        .filter(
          (p) =>
            p.category_id === categoryId &&
            p.in_stock &&
            p.id !== productId
        )
        .slice(0, 3);
    },
    enabled: !!categoryId,
  });
};
