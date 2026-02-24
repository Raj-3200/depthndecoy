// Firebase / Firestore type definitions matching the previous Supabase schema

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string | null;
  images: string[] | null;
  colors: string[] | null;
  sizes: string[] | null;
  details: string[] | null;
  category_id: string | null;
  featured: boolean;
  is_new: boolean;
  in_stock: boolean;
  stock_quantity: number | null;
  created_at: string;
  updated_at: string;
  // Joined field (populated after query)
  category?: Category | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  shipping_address: Record<string, any> | null;
  billing_address: Record<string, any> | null;
  payment_status: string | null;
  payment_intent_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  // Joined field
  product?: Product | null;
}

export type AppRole = "admin" | "user";

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}
