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

// Helper: fetch a single category by ID
const fetchCategory = async (categoryId: string): Promise<Category | null> => {
  const snap = await getDoc(doc(db, "categories", categoryId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Category;
};

// Helper: attach category to product
const attachCategory = async (product: Product): Promise<Product> => {
  if (product.category_id) {
    product.category = await fetchCategory(product.category_id);
  }
  return product;
};

export const useProducts = (filters?: {
  category?: string;
  featured?: boolean;
  isNew?: boolean;
}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const constraints: any[] = [
        where("in_stock", "==", true),
        orderBy("created_at", "desc"),
      ];

      // If filtering by category slug, resolve slug → id first
      if (filters?.category && filters.category !== "all") {
        const catQuery = query(
          collection(db, "categories"),
          where("slug", "==", filters.category)
        );
        const catSnap = await getDocs(catQuery);
        if (!catSnap.empty) {
          const catId = catSnap.docs[0].id;
          constraints.push(where("category_id", "==", catId));
        } else {
          return [] as Product[];
        }
      }

      if (filters?.featured) {
        constraints.push(where("featured", "==", true));
      }

      if (filters?.isNew) {
        constraints.push(where("is_new", "==", true));
      }

      const q = query(collection(db, "products"), ...constraints);
      const snap = await getDocs(q);
      const products = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Product
      );

      // Attach categories
      await Promise.all(products.map(attachCategory));

      return products;
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const q = query(
        collection(db, "products"),
        where("slug", "==", slug)
      );
      const snap = await getDocs(q);
      if (snap.empty) throw new Error("Product not found");
      const product = { id: snap.docs[0].id, ...snap.docs[0].data() } as Product;
      await attachCategory(product);
      return product;
    },
    enabled: !!slug,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const q = query(
        collection(db, "products"),
        where("featured", "==", true),
        where("in_stock", "==", true),
        orderBy("created_at", "desc")
      );
      const snap = await getDocs(q);
      const products = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Product
      );
      await Promise.all(products.map(attachCategory));
      return products;
    },
  });
};

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ["products", "new"],
    queryFn: async () => {
      const q = query(
        collection(db, "products"),
        where("is_new", "==", true),
        where("in_stock", "==", true),
        orderBy("created_at", "desc")
      );
      const snap = await getDocs(q);
      const products = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Product
      );
      await Promise.all(products.map(attachCategory));
      return products;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const q = query(collection(db, "categories"), orderBy("name"));
      const snap = await getDocs(q);
      return snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Category
      );
    },
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

      const q = query(
        collection(db, "products"),
        where("category_id", "==", categoryId),
        where("in_stock", "==", true),
        limit(4)
      );
      const snap = await getDocs(q);
      const products = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as Product)
        .filter((p) => p.id !== productId)
        .slice(0, 3);

      await Promise.all(products.map(attachCategory));
      return products;
    },
    enabled: !!categoryId,
  });
};
