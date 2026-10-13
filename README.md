# TEE HUB — Premium T-Shirt E-Commerce Platform

> **"Find Your Fit. Own Your Style."**
> A production-ready, full-stack streetwear clothing platform engineered for Indian contemporary fashion. Crafted for tactile longevity with custom knitted 240–280 GSM organic French Terry cotton, drop-shoulder geometry, interactive 360° rotational garment viewers, and pan-India checkout.

---

## 🌟 Key Features

1. **Interactive 360-Degree Product Viewing Experience**
   - Full 36-frame rotational sequence inspection per garment.
   - Smooth mouse drag and mobile touch scrub gestures.
   - Auto-spin mode with play/pause and frame indicators (`FRAME 12 / 36`).
   - Pedestal studio stage disk and zoom in/out controls.
   - **Real Look — 8 Angles** studio capture strip (Front, Right Side, Back, Left Side, Top Neck, Bottom Hem, Puff Print, Folded).

2. **Full-Featured Storefront & Catalog**
   - Cinematic hero rack showcase of hanging garments on premium light oak hangers.
   - Value proposition ticker (Fast Shipping, 100% Secure, 7-Day Free Return, 100% Combed Cotton).
   - Category filtering (Oversized, Graphic Tees, Minimalist, Plain, Vintage Graphic, Acid Wash).
   - Dynamic price in INR with real discounts (no fake countdowns).
   - Color swatches, size selector (S, M, L, XL, XXL) with live variant inventory counts.
   - Interactive 3D Size Chart & Streetwear Fit Finder modal.

3. **Cart & Pan-India Checkout**
   - Slide-over cart drawer and full cart page.
   - Dynamic progress bar for free shipping threshold (₹999).
   - Coupon discount engine (e.g., `FIRSTTEE150` for ₹150 off, `TEEHUB10` for 10% off).
   - Multi-step checkout with Indian delivery addresses (State, Pincode validation).
   - Razorpay payment gateway simulation with server-side HMAC SHA256 signature verification.
   - Cash on Delivery (COD) as an optional admin-controlled method.

4. **Order Tracking & Account Management**
   - Live visual step-by-step shipment tracker (Confirmed → Processing → Packed → Shipped → Out for Delivery → Delivered).
   - Courier partner integration (Delhivery Surface Express, Blue Dart Air).
   - Order history, saved delivery destinations, and live wishlist.

5. **Customer Reviews & Photo Looks ("Real People. Real Style.")**
   - Verified buyer ratings and reviews with real outfit photos.
   - Helpful upvote counters.
   - Customer review submission form with photo link and star rating.

6. **Admin Dashboard**
   - KPI metrics: Total revenue, total orders, pending orders, total stock, and low-stock alerts.
   - Product catalog CRUD: Create, edit, delete, set sale prices, and manage variant inventory.
   - Order management: Search by order ID, manage status transitions, and tracking numbers.
   - Review moderation: Approve, reject, or remove customer photo reviews.
   - Store settings: Manage top announcement bar, shipping thresholds, COD toggle, and support contacts.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, React Router 7, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express 4, TypeScript (via tsx).
- **Database ORM**: Prisma ORM with relational schema (`prisma/schema.prisma`).
- **Database Engine**: PostgreSQL (Neon, Supabase, Cloud SQL, or Render Postgres).
- **Payment Gateway**: Razorpay (INR transactions, webhook, and server verification).
- **Image Storage**: Cloudinary / CDN with multiple angle photography.

---

## 📁 Project Structure

```
.
├── prisma/
│   └── schema.prisma         # Relational database models (User, Product, Order, Review, etc.)
├── src/
│   ├── components/
│   │   ├── 360Viewer/        # Product360Viewer (36 frames, auto-spin, gesture scrub)
│   │   ├── common/           # Header, Footer, AnnouncementBar, CartDrawer, SizeGuide, Search
│   │   └── product/          # ProductCard with quick-add and color swatches
│   ├── context/
│   │   ├── AuthContext.tsx    # User login, demo customer/admin, saved addresses
│   │   ├── CartContext.tsx    # Persistent cart, subtotal, coupons, free shipping logic
│   │   └── WishlistContext.tsx# Live wishlist toggle and badge
│   ├── data/
│   │   └── initialData.ts    # Seed products, 360 frames, reviews, coupons, settings
│   ├── pages/
│   │   ├── HomePage.tsx      # Landing page matching mockup Image 1
│   │   ├── ShopPage.tsx      # Filterable catalog with URL sync
│   │   ├── ProductDetailPage.tsx # PDP matching mockup Image 3
│   │   ├── CartPage.tsx      # Full cart view
│   │   ├── CheckoutPage.tsx  # Indian address form, Razorpay simulator, COD
│   │   ├── OrderConfirmationPage.tsx # Confetti, invoice summary
│   │   ├── OrderTrackingPage.tsx # Visual shipment progress stepper
│   │   ├── AccountPage.tsx   # User profile, past orders, wishlist
│   │   ├── AboutPage.tsx     # Tirupur milling, sizing, care, returns
│   │   └── AdminDashboard.tsx# Operations, products CRUD, orders, moderation
│   ├── services/
│   │   └── api.ts            # API client with offline local sync
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   ├── App.tsx               # Main routing & layout
│   ├── index.css             # Tailwind v4 theme & font variables
│   └── main.tsx              # React DOM entry point
├── tests/
│   └── ecommerce.test.ts     # Test suite for pricing, coupons, stock, and Razorpay
├── server.ts                 # Full-stack Express API server with Vite middleware in dev
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your values for `DATABASE_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, etc.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Start Local Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

---

## 🚢 Deployment Guide

### Deploying Frontend to Vercel
1. Push your repository to GitHub.
2. In Vercel, import the repository.
3. Set Framework Preset to **Vite**.
4. Set Build Command to `npm run build` and Output Directory to `dist`.
5. Add Environment Variable:
   - `VITE_API_BASE_URL`: URL of your deployed backend (e.g. `https://teehub-api.onrender.com`).

### Deploying Backend to Render / Railway
1. Create a new **Web Service** on Render or Railway.
2. Build Command: `npm run build`
3. Start Command: `npm start`
4. Set Environment Variables:
   - `DATABASE_URL`: PostgreSQL connection URL
   - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`
   - `SESSION_SECRET`
   - `PORT`: `3000`

### Database Setup with Prisma
```bash
npx prisma generate
npx prisma db push
```

---

## 🔒 Security Best Practices

- Prices and discounts are recalculated on the server during order creation.
- Sensitive payment secrets (`RAZORPAY_KEY_SECRET`) are never exposed to frontend client code.
- Cryptographic HMAC SHA-256 signature verification ensures payments cannot be spoofed.
- Stock counts are decremented atomically to prevent overselling.
