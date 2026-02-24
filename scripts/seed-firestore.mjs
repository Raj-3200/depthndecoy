/**
 * Firestore seed script — populates categories and products for Depth & Decoy.
 * Run: node scripts/seed-firestore.mjs
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA959LkNh4WQzKISme24hp-xW2vVZxjQCc",
  authDomain: "depthndecoy.firebaseapp.com",
  projectId: "depthndecoy",
  storageBucket: "depthndecoy.firebasestorage.app",
  messagingSenderId: "317373309123",
  appId: "1:317373309123:web:aeae019edc5fad1b44c276",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const now = new Date().toISOString();

// ─── Categories ──────────────────────────────────────────────────
const categories = [
  {
    id: "cat-tshirts",
    name: "T-Shirts",
    slug: "t-shirts",
    description: "Premium heavyweight cotton tees built to last.",
    created_at: now,
  },
  {
    id: "cat-hoodies",
    name: "Hoodies",
    slug: "hoodies",
    description: "Oversized, heavyweight hoodies for layered comfort.",
    created_at: now,
  },
  {
    id: "cat-jackets",
    name: "Jackets",
    slug: "jackets",
    description: "Statement outerwear crafted for presence.",
    created_at: now,
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Finishing pieces that complete the look.",
    created_at: now,
  },
];

// ─── Products ────────────────────────────────────────────────────
const products = [
  {
    id: "prod-obsidian-tee",
    name: "Obsidian Tee",
    slug: "obsidian-tee",
    price: 65,
    description:
      "A pitch-black oversized tee cut from 280 GSM ringspun cotton. Dropped shoulders, raw-edge hem, and a silent logo hit at the back neck.",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
    ],
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    details: [
      "280 GSM ringspun cotton",
      "Oversized drop-shoulder fit",
      "Raw-edge hem",
      "Back-neck logo embroidery",
    ],
    category_id: "cat-tshirts",
    featured: true,
    is_new: false,
    in_stock: true,
    stock_quantity: 120,
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-phantom-hoodie",
    name: "Phantom Hoodie",
    slug: "phantom-hoodie",
    price: 120,
    description:
      "Heavyweight 400 GSM French terry hoodie in washed black. Double-layered hood, kangaroo pocket, and ribbed cuffs built to endure.",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
    ],
    colors: ["Black", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    details: [
      "400 GSM French terry",
      "Double-layered hood",
      "Kangaroo pocket",
      "Ribbed cuffs and hem",
    ],
    category_id: "cat-hoodies",
    featured: true,
    is_new: false,
    in_stock: true,
    stock_quantity: 80,
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-veil-jacket",
    name: "Veil Jacket",
    slug: "veil-jacket",
    price: 285,
    description:
      "Minimal moto silhouette in matte black lambskin. Asymmetric zip, mandarin collar, and clean interior lining — no excess, all edge.",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&q=80",
    ],
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    details: [
      "Genuine lambskin leather",
      "Asymmetric front zip",
      "Mandarin collar",
      "Interior twill lining",
    ],
    category_id: "cat-jackets",
    featured: true,
    is_new: false,
    in_stock: true,
    stock_quantity: 30,
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-dusk-tee",
    name: "Dusk Tee",
    slug: "dusk-tee",
    price: 65,
    description:
      "A sun-faded dark grey tee with a garment-dyed enzyme wash. Relaxed body, subtle chest logo, and lived-in feel from day one.",
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    ],
    colors: ["Dark Grey", "Washed Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    details: [
      "260 GSM garment-dyed cotton",
      "Enzyme wash finish",
      "Relaxed fit",
      "Chest logo print",
    ],
    category_id: "cat-tshirts",
    featured: false,
    is_new: true,
    in_stock: true,
    stock_quantity: 95,
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-echo-hoodie",
    name: "Echo Hoodie",
    slug: "echo-hoodie",
    price: 135,
    description:
      "Full-zip charcoal hoodie in brushed-back fleece. Split kangaroo pockets, tonal zippers, and an embroidered wordmark along the left sleeve.",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    ],
    colors: ["Charcoal", "Black"],
    sizes: ["S", "M", "L", "XL"],
    details: [
      "380 GSM brushed-back fleece",
      "Full-zip front",
      "Split kangaroo pockets",
      "Sleeve wordmark embroidery",
    ],
    category_id: "cat-hoodies",
    featured: true,
    is_new: false,
    in_stock: true,
    stock_quantity: 60,
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-mirage-bomber",
    name: "Mirage Bomber",
    slug: "mirage-bomber",
    price: 245,
    description:
      "An olive-drab nylon bomber with a padded lining and clean snap closure. Utility pockets at the chest and a ribbed collar that holds its shape.",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
    ],
    colors: ["Olive", "Black"],
    sizes: ["S", "M", "L", "XL"],
    details: [
      "Nylon shell with padded lining",
      "Snap-button closure",
      "Chest utility pockets",
      "Ribbed collar, cuffs, and hem",
    ],
    category_id: "cat-jackets",
    featured: false,
    is_new: true,
    in_stock: true,
    stock_quantity: 40,
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-shadow-cap",
    name: "Shadow Cap",
    slug: "shadow-cap",
    price: 45,
    description:
      "Structured six-panel cap in matte black with a tonal embroidered logo. Adjustable brass clasp at the back for a clean fit.",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=800&q=80",
    ],
    colors: ["Black"],
    sizes: ["One Size"],
    details: [
      "100% cotton twill",
      "Six-panel structured crown",
      "Tonal embroidered logo",
      "Brass clasp adjustment",
    ],
    category_id: "cat-accessories",
    featured: true,
    is_new: false,
    in_stock: true,
    stock_quantity: 150,
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-depth-tee",
    name: "Depth Tee",
    slug: "depth-tee",
    price: 60,
    description:
      "A bone-white essential tee with a subtle raised rubber logo at the chest. Cut from Japanese Supima cotton for a refined drape.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&q=80",
    ],
    colors: ["White", "Off-White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    details: [
      "Japanese Supima cotton",
      "Raised rubber chest logo",
      "Regular fit",
      "Pre-shrunk",
    ],
    category_id: "cat-tshirts",
    featured: false,
    is_new: true,
    in_stock: true,
    stock_quantity: 110,
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-decoy-parka",
    name: "Decoy Parka",
    slug: "decoy-parka",
    price: 350,
    description:
      "An oversized insulated parka in stealth black. Fishtail hem, adjustable drawcord waist, and a detachable hood built for harsh conditions.",
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    ],
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    details: [
      "Water-resistant nylon shell",
      "Synthetic insulation fill",
      "Detachable hood",
      "Fishtail hem with drawcord",
    ],
    category_id: "cat-jackets",
    featured: false,
    is_new: true,
    in_stock: true,
    stock_quantity: 25,
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-noir-beanie",
    name: "Noir Beanie",
    slug: "noir-beanie",
    price: 38,
    description:
      "A ribbed-knit beanie in jet black merino wool. Fold-over cuff with a woven label — simple, warm, and built for every season.",
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80",
    ],
    colors: ["Black", "Charcoal"],
    sizes: ["One Size"],
    details: [
      "100% merino wool",
      "Ribbed knit construction",
      "Fold-over cuff",
      "Woven brand label",
    ],
    category_id: "cat-accessories",
    featured: false,
    is_new: true,
    in_stock: true,
    stock_quantity: 200,
    created_at: now,
    updated_at: now,
  },
];

// ─── Seed logic ──────────────────────────────────────────────────
async function seed() {
  console.log("Seeding categories…");
  for (const cat of categories) {
    const { id, ...data } = cat;
    await setDoc(doc(db, "categories", id), data);
    console.log(`  ✓ ${cat.name}`);
  }

  console.log("\nSeeding products…");
  for (const prod of products) {
    const { id, ...data } = prod;
    await setDoc(doc(db, "products", id), data);
    console.log(`  ✓ ${prod.name}`);
  }

  console.log("\n✅ Firestore seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
