import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/integrations/firebase/config";
import type { Product, Category } from "@/integrations/firebase/types";

export type { Product, Category };

// ─── Fetch ALL products once, cache via React Query ──────────────
// For a catalog of <500 products this is faster and avoids composite index issues.
const fetchAllProducts = async (): Promise<Product[]> => {
  const snap = await getDocs(collection(db, "products"));
  const products = snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Product
  );

  // Fetch all categories in one go
  const catSnap = await getDocs(collection(db, "categories"));
  const catMap = new Map<string, Category>();
  catSnap.docs.forEach((d) => {
    catMap.set(d.id, { id: d.id, ...d.data() } as Category);
  });

  // Attach categories
  products.forEach((p) => {
    if (p.category_id) {
      p.category = catMap.get(p.category_id) || null;
    }
  });

  // Sort newest first
  products.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return products;
};

// Base hook — all other hooks derive from this cached data
const useAllProducts = () => {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: fetchAllProducts,
    staleTime: 5 * 60 * 1000, // cache for 5 min
  });
};

export const useProducts = (filters?: {
  category?: string;
  featured?: boolean;
  isNew?: boolean;
}) => {
  const { data: all = [], ...rest } = useAllProducts();

  let filtered = all.filter((p) => p.in_stock);

  if (filters?.category && filters.category !== "all") {
    filtered = filtered.filter(
      (p) => p.category?.slug === filters.category
    );
  }
  if (filters?.featured) {
    filtered = filtered.filter((p) => p.featured);
  }
  if (filters?.isNew) {
    filtered = filtered.filter((p) => p.is_new);
  }

  return { ...rest, data: filtered };
};

export const useProduct = (slug: string) => {
  const { data: all = [], ...rest } = useAllProducts();
  const product = all.find((p) => p.slug === slug) || null;

  return {
    ...rest,
    data: product,
    isError: rest.isSuccess && !product,
    error: rest.isSuccess && !product ? new Error("Product not found") : null,
  };
};

export const useFeaturedProducts = () => {
  const { data: all = [], ...rest } = useAllProducts();
  return {
    ...rest,
    data: all.filter((p) => p.featured && p.in_stock),
  };
};

export const useNewArrivals = () => {
  const { data: all = [], ...rest } = useAllProducts();
  return {
    ...rest,
    data: all.filter((p) => p.is_new && p.in_stock),
  };
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const snap = await getDocs(collection(db, "categories"));
      const cats = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Category
      );
      return cats.sort((a, b) => a.name.localeCompare(b.name));
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useRelatedProducts = (
  productId: string,
  categoryId: string | null
) => {
  const { data: all = [], ...rest } = useAllProducts();
  const related = categoryId
    ? all
        .filter(
          (p) =>
            p.category_id === categoryId &&
            p.in_stock &&
            p.id !== productId
        )
        .slice(0, 3)
    : [];

  return { ...rest, data: related, enabled: !!categoryId };
};
