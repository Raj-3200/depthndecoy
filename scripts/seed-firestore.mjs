/**
 * Firestore seed script — populates categories and products for Depth & Decoy.
 *
 * Uses Firebase Admin SDK which BYPASSES security rules.
 *
 * Usage:
 *   1. Download your service account key from Firebase Console:
 *      Project Settings → Service Accounts → Generate New Private Key
 *   2. Save it as  scripts/serviceAccountKey.json
 *   3. Run:  node scripts/seed-firestore.mjs
 */

import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Load service account key
let serviceAccount;
try {
  serviceAccount = JSON.parse(
    readFileSync(new URL("./serviceAccountKey.json", import.meta.url), "utf8")
  );
} catch {
  console.error(
    "\n❌  Missing service account key!\n\n" +
      "   1. Go to https://console.firebase.google.com/project/depthndecoy/settings/serviceaccounts/adminsdk\n" +
      "   2. Click  \"Generate New Private Key\"\n" +
      "   3. Save the downloaded JSON as:\n" +
      "      scripts/serviceAccountKey.json\n" +
      "   4. Re-run:  node scripts/seed-firestore.mjs\n"
  );
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

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
    id: "cat-shirts",
    name: "Shirts",
    slug: "shirts",
    description: "Refined luxury shirts for every occasion.",
    created_at: now,
  },
  {
    id: "cat-trousers",
    name: "Trousers",
    slug: "trousers",
    description: "Tailored fits and premium fabrics for the modern man.",
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

// ─── Products (prices in INR) ────────────────────────────────────
const products = [
  // ── T-Shirts ──
  {
    id: "prod-obsidian-tee",
    name: "Obsidian Tee",
    slug: "obsidian-tee",
    price: 2499,
    description:
      "A pitch-black oversized tee cut from 280 GSM ringspun cotton. Dropped shoulders, raw-edge hem, and a silent logo hit at the back neck. The foundation of every Depth & Decoy wardrobe.",
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
      "Pre-washed for softness",
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
    id: "prod-dusk-tee",
    name: "Dusk Tee",
    slug: "dusk-tee",
    price: 2299,
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
      "Reinforced shoulder seams",
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
    id: "prod-depth-tee",
    name: "Depth Tee",
    slug: "depth-tee",
    price: 1999,
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
      "Double-stitched hems",
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
    id: "prod-shadow-script-tee",
    name: "Shadow Script Tee",
    slug: "shadow-script-tee",
    price: 2799,
    description:
      "Quote series statement tee featuring tonal screen-printed typography on heavyweight washed cotton. The words you carry define the man you become.",
    images: [
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
    ],
    colors: ["Black", "Charcoal"],
    sizes: ["S", "M", "L", "XL"],
    details: [
      "300 GSM heavyweight cotton",
      "Tonal screen-print typography",
      "Quote Series collection",
      "Boxy oversized fit",
      "Vintage wash finish",
    ],
    category_id: "cat-tshirts",
    featured: true,
    is_new: true,
    in_stock: true,
    stock_quantity: 75,
    created_at: now,
    updated_at: now,
  },

  // ── Hoodies ──
  {
    id: "prod-phantom-hoodie",
    name: "Phantom Hoodie",
    slug: "phantom-hoodie",
    price: 4999,
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
      "YKK hardware",
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
    id: "prod-echo-hoodie",
    name: "Echo Hoodie",
    slug: "echo-hoodie",
    price: 5499,
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
      "Relaxed oversized fit",
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
    id: "prod-monolith-hoodie",
    name: "Monolith Hoodie",
    slug: "monolith-hoodie",
    price: 5999,
    description:
      "The ultimate luxury pullover. 450 GSM double-face jersey with a structured hood, hidden side pockets, and a clean back panel.",
    images: [
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80",
      "https://images.unsplash.com/photo-1542327897-d73f4005b533?w=800&q=80",
    ],
    colors: ["Smoke Grey", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    details: [
      "450 GSM double-face jersey",
      "Structured hood with drawcord",
      "Hidden side-seam pockets",
      "Clean back panel",
      "Premium dyed finish",
    ],
    category_id: "cat-hoodies",
    featured: true,
    is_new: true,
    in_stock: true,
    stock_quantity: 40,
    created_at: now,
    updated_at: now,
  },

  // ── Jackets ──
  {
    id: "prod-veil-jacket",
    name: "Veil Jacket",
    slug: "veil-jacket",
    price: 12999,
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
      "Handcrafted in India",
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
    id: "prod-mirage-bomber",
    name: "Mirage Bomber",
    slug: "mirage-bomber",
    price: 8999,
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
      "Water-resistant coating",
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
    id: "prod-decoy-parka",
    name: "Decoy Parka",
    slug: "decoy-parka",
    price: 14999,
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
      "Storm-proof zippers",
    ],
    category_id: "cat-jackets",
    featured: false,
    is_new: true,
    in_stock: true,
    stock_quantity: 25,
    created_at: now,
    updated_at: now,
  },

  // ── Shirts ──
  {
    id: "prod-onyx-linen-shirt",
    name: "Onyx Linen Shirt",
    slug: "onyx-linen-shirt",
    price: 3999,
    description:
      "Premium Japanese linen shirt with a relaxed drape and hidden placket. Designed for summer evenings and winter layering alike.",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
    ],
    colors: ["Black", "Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    details: [
      "100% Japanese linen",
      "Hidden button placket",
      "Relaxed oversized fit",
      "Mother-of-pearl buttons",
      "French seams throughout",
    ],
    category_id: "cat-shirts",
    featured: true,
    is_new: true,
    in_stock: true,
    stock_quantity: 55,
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-stealth-oxford",
    name: "Stealth Oxford",
    slug: "stealth-oxford",
    price: 3499,
    description:
      "A refined oxford shirt in brushed cotton. Button-down collar, single chest pocket, and back box pleat for mobility.",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    ],
    colors: ["White", "Light Blue", "Black"],
    sizes: ["S", "M", "L", "XL"],
    details: [
      "Premium brushed cotton oxford",
      "Button-down collar",
      "Single chest pocket",
      "Back box pleat",
      "Slim-regular fit",
    ],
    category_id: "cat-shirts",
    featured: false,
    is_new: false,
    in_stock: true,
    stock_quantity: 70,
    created_at: now,
    updated_at: now,
  },

  // ── Trousers ──
  {
    id: "prod-silhouette-trousers",
    name: "Silhouette Trousers",
    slug: "silhouette-trousers",
    price: 4499,
    description:
      "Wide-leg tailored trousers in Italian wool blend. High waist with double pleats, side pockets, and a clean pressed crease.",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    ],
    colors: ["Black", "Charcoal"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    details: [
      "Italian wool-blend fabric",
      "High waist with double pleats",
      "Pressed crease finish",
      "On-seam side pockets",
      "Tailored wide-leg silhouette",
    ],
    category_id: "cat-trousers",
    featured: true,
    is_new: true,
    in_stock: true,
    stock_quantity: 50,
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-cargo-joggers",
    name: "Stealth Cargo Joggers",
    slug: "stealth-cargo-joggers",
    price: 3999,
    description:
      "Technical cargo joggers in ripstop nylon with a tapered leg. Six-pocket utility design with elastic waist and adjustable drawcord.",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
    ],
    colors: ["Black", "Olive"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    details: [
      "Ripstop nylon fabric",
      "Six-pocket utility design",
      "Elastic waist with drawcord",
      "Tapered leg with cuff",
      "Water-resistant finish",
    ],
    category_id: "cat-trousers",
    featured: false,
    is_new: true,
    in_stock: true,
    stock_quantity: 65,
    created_at: now,
    updated_at: now,
  },

  // ── Accessories ──
  {
    id: "prod-shadow-cap",
    name: "Shadow Cap",
    slug: "shadow-cap",
    price: 1499,
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
    id: "prod-noir-beanie",
    name: "Noir Beanie",
    slug: "noir-beanie",
    price: 1299,
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
  {
    id: "prod-leather-belt",
    name: "Chronicle Belt",
    slug: "chronicle-belt",
    price: 2999,
    description:
      "Full-grain Italian leather belt with a matte black buckle. 35mm width, hand-finished edges, and a discreet embossed logo.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    ],
    colors: ["Black", "Dark Brown"],
    sizes: ["30", "32", "34", "36", "38"],
    details: [
      "Full-grain Italian leather",
      "Matte black zinc-alloy buckle",
      "35mm width",
      "Hand-finished edges",
      "Embossed logo detail",
    ],
    category_id: "cat-accessories",
    featured: true,
    is_new: false,
    in_stock: true,
    stock_quantity: 90,
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-tote-bag",
    name: "Depth Tote",
    slug: "depth-tote",
    price: 3499,
    description:
      "Oversized canvas tote in waxed cotton with leather handles and a magnetized closure. Internal laptop sleeve and zip pocket.",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    ],
    colors: ["Black", "Olive"],
    sizes: ["One Size"],
    details: [
      "Waxed cotton canvas",
      "Full-grain leather handles",
      "Magnetized top closure",
      "Internal laptop sleeve (15\")",
      "Interior zip pocket",
    ],
    category_id: "cat-accessories",
    featured: false,
    is_new: true,
    in_stock: true,
    stock_quantity: 45,
    created_at: now,
    updated_at: now,
  },
];

// ─── Seed logic ──────────────────────────────────────────────────
async function seed() {
  console.log("Seeding categories…");
  for (const cat of categories) {
    const { id, ...data } = cat;
    await db.collection("categories").doc(id).set(data);
    console.log(`  ✓ ${cat.name}`);
  }

  console.log("\nSeeding products…");
  for (const prod of products) {
    const { id, ...data } = prod;
    await db.collection("products").doc(id).set(data);
    console.log(`  ✓ ${prod.name} — ₹${prod.price.toLocaleString("en-IN")}`);
  }

  console.log("\n✅ Firestore seeded successfully with luxury products!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
