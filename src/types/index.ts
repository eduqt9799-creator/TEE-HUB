export type TShirtFit = 'Oversized' | 'Regular' | 'Boxy' | 'Unisex Heavy' | 'Drop Shoulder';

export type TShirtCategory = 
  | 'Oversized' 
  | 'Graphic Tees' 
  | 'Minimalist' 
  | 'Plain' 
  | 'Vintage Graphic' 
  | 'Acid Wash' 
  | 'New Arrivals' 
  | 'Best Sellers';

export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductColor {
  name: string;
  hex: string;
  tailwindClass?: string;
}

export interface ProductVariant {
  id: string;
  size: ProductSize;
  color: string;
  colorHex: string;
  stock: number;
  sku: string;
}

export interface AngleImage {
  angleName: string; // 'Front', 'Right Side', 'Back', 'Left Side', 'Top Neck', 'Bottom Hem', 'Puff Print', 'Folded'
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: TShirtCategory;
  fit: TShirtFit;
  gsm: number; // e.g. 240, 260, 280
  fabric: string; // e.g. '100% Organic French Terry Long-Staple Combed Cotton'
  price: number; // in INR e.g. 699, 899
  originalPrice: number; // in INR e.g. 1299
  discountPercent: number; // calculated or real
  colors: ProductColor[];
  sizes: ProductSize[];
  variants: ProductVariant[];
  thumbnail: string;
  secondaryImage?: string;
  angleImages: AngleImage[];
  frame360Images: string[]; // sequence of 36 frames
  rating: number; // e.g. 4.8
  reviewCount: number;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  tag?: string; // '240 GSM', 'Bestseller', 'Limited 500 pcs', 'Street Classic', 'Trending'
  details: {
    collar: string;
    washCare: string;
    shrinkage: string;
    printType: string;
    modelHeight: string;
    modelWearingSize: ProductSize;
  };
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  authorName: string;
  authorInitials: string;
  city: string;
  sizeBought: ProductSize;
  colorBought: string;
  rating: number; // 1 to 5
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  helpfulCount: number;
  photoUrl?: string;
  usageDuration?: string; // e.g. 'Worn 3 weeks'
  status: 'approved' | 'pending' | 'rejected';
}

export interface CartItem {
  id: string; // unique item id in cart
  productId: string;
  productName: string;
  slug: string;
  price: number;
  image: string;
  size: ProductSize;
  color: string;
  colorHex: string;
  quantity: number;
  gsm: number;
  fit: string;
}

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested'
  | 'Returned'
  | 'Refunded';

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
  location?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string; // e.g. 'TH-84920'
  userId?: string;
  guestEmail?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCharge: number;
  total: number;
  appliedCoupon?: string;
  shippingAddress: ShippingAddress;
  paymentMethod: 'Razorpay' | 'UPI' | 'COD';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
  trackingNumber?: string;
  carrierName?: string;
  estimatedDeliveryDate: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  savedAddresses: ShippingAddress[];
  createdAt: string;
}

export interface Coupon {
  code: string;
  type: 'flat' | 'percentage';
  value: number; // e.g. 150 (INR) or 10 (%)
  minOrderValue: number;
  description: string;
  isActive: boolean;
}

export interface BusinessSettings {
  storeName: string;
  tagline: string;
  announcementText: string;
  announcementSubtext: string;
  announcementActive: boolean;
  freeShippingThreshold: number; // default 999
  standardShippingFee: number; // default 99
  codEnabled: boolean;
  razorpayTestMode: boolean;
  supportEmail: string;
  supportPhone: string;
  heroHeading: string;
  heroSubtitle: string;
}
