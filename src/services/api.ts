import { 
  Product, 
  Review, 
  Order, 
  Coupon, 
  BusinessSettings, 
  User, 
  ShippingAddress, 
  CartItem, 
  OrderStatus 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_REVIEWS, 
  SAMPLE_ORDERS, 
  INITIAL_COUPONS, 
  INITIAL_SETTINGS 
} from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'teehub_products_v1',
  REVIEWS: 'teehub_reviews_v1',
  ORDERS: 'teehub_orders_v1',
  SETTINGS: 'teehub_settings_v1',
  USER: 'teehub_user_v1',
  COUPONS: 'teehub_coupons_v1',
  WISHLIST: 'teehub_wishlist_v1',
};

// Seed or retrieve from localStorage
function getStored<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('Failed saving to localStorage', err);
  }
}

// Ensure initial state exists
export function initLocalStorage(): void {
  getStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  getStored(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  getStored(STORAGE_KEYS.ORDERS, SAMPLE_ORDERS);
  getStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  getStored(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
}

export const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    return getStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.slug === slug) || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id) || null;
  },

  async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const products = await this.getProducts();
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    setStored(STORAGE_KEYS.PRODUCTS, products);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    const updated = { ...products[index], ...updates };
    products[index] = updated;
    setStored(STORAGE_KEYS.PRODUCTS, products);
    return updated;
  },

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    setStored(STORAGE_KEYS.PRODUCTS, filtered);
  },

  // Reviews
  async getReviews(productId?: string): Promise<Review[]> {
    const all = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    if (productId) {
      return all.filter((r) => r.productId === productId && r.status === 'approved');
    }
    return all;
  },

  async getAllReviewsForAdmin(): Promise<Review[]> {
    return getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  },

  async submitReview(reviewData: {
    productId: string;
    productName: string;
    authorName: string;
    city: string;
    sizeBought: any;
    colorBought: string;
    rating: number;
    comment: string;
    photoUrl?: string;
  }): Promise<Review> {
    const all = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const initials = reviewData.authorName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'TH';

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      ...reviewData,
      authorInitials: initials,
      verifiedPurchase: true,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
      usageDuration: 'Verified Buyer',
      status: 'approved', // Auto-approved or moderation can toggle
    };

    all.unshift(newRev);
    setStored(STORAGE_KEYS.REVIEWS, all);

    // Update product rating and review count
    const products = await this.getProducts();
    const prod = products.find((p) => p.id === reviewData.productId);
    if (prod) {
      const prodRevs = all.filter((r) => r.productId === prod.id && r.status === 'approved');
      const avg = prodRevs.reduce((acc, r) => acc + r.rating, 0) / prodRevs.length;
      await this.updateProduct(prod.id, {
        rating: Number(avg.toFixed(1)),
        reviewCount: prodRevs.length,
      });
    }

    return newRev;
  },

  async voteHelpful(reviewId: string): Promise<number> {
    const all = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const rev = all.find((r) => r.id === reviewId);
    if (!rev) throw new Error('Review not found');
    rev.helpfulCount += 1;
    setStored(STORAGE_KEYS.REVIEWS, all);
    return rev.helpfulCount;
  },

  async updateReviewStatus(reviewId: string, status: 'approved' | 'rejected'): Promise<Review> {
    const all = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const rev = all.find((r) => r.id === reviewId);
    if (!rev) throw new Error('Review not found');
    rev.status = status;
    setStored(STORAGE_KEYS.REVIEWS, all);
    return rev;
  },

  // Orders
  async getOrders(userId?: string): Promise<Order[]> {
    const all = getStored<Order[]>(STORAGE_KEYS.ORDERS, SAMPLE_ORDERS);
    if (userId) {
      return all.filter((o) => o.userId === userId);
    }
    return all;
  },

  async getOrderById(id: string): Promise<Order | null> {
    const all = getStored<Order[]>(STORAGE_KEYS.ORDERS, SAMPLE_ORDERS);
    return all.find((o) => o.id.toUpperCase() === id.toUpperCase()) || null;
  },

  async createOrder(orderPayload: {
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
    razorpayPaymentId?: string;
  }): Promise<Order> {
    const all = getStored<Order[]>(STORAGE_KEYS.ORDERS, SAMPLE_ORDERS);
    const orderNum = `TH-${Math.floor(10000 + Math.random() * 90000)}`;

    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 3);
    const estDeliveryStr = estDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newOrder: Order = {
      id: orderNum,
      ...orderPayload,
      paymentStatus: orderPayload.paymentMethod === 'COD' ? 'Pending' : 'Paid',
      status: 'Confirmed',
      trackingNumber: `EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      carrierName: 'Delhivery Surface Express',
      estimatedDeliveryDate: estDeliveryStr,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Confirmed',
          timestamp: new Date().toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          description: orderPayload.paymentMethod === 'COD' 
            ? 'Order confirmed. Cash on Delivery selected.' 
            : `Order confirmed via ${orderPayload.paymentMethod}. Payment ID: ${orderPayload.razorpayPaymentId || 'Verified'}`,
        },
      ],
    };

    all.unshift(newOrder);
    setStored(STORAGE_KEYS.ORDERS, all);

    // Decrement stock in product variants safely
    const products = await this.getProducts();
    for (const item of orderPayload.items) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const variant = prod.variants.find(
          (v) => v.size === item.size && v.color.toLowerCase() === item.color.toLowerCase()
        );
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
        }
      }
    }
    setStored(STORAGE_KEYS.PRODUCTS, products);

    return newOrder;
  },

  async updateOrderStatus(
    orderId: string, 
    newStatus: OrderStatus, 
    notes?: string, 
    location?: string
  ): Promise<Order> {
    const all = getStored<Order[]>(STORAGE_KEYS.ORDERS, SAMPLE_ORDERS);
    const order = all.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.status = newStatus;
    if (newStatus === 'Delivered' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'Paid';
    }

    order.timeline.push({
      status: newStatus,
      timestamp: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      description: notes || `Order status updated to ${newStatus}.`,
      location,
    });

    setStored(STORAGE_KEYS.ORDERS, all);
    return order;
  },

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    return getStored(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  },

  async validateCoupon(code: string, cartTotal: number): Promise<{ valid: boolean; discount: number; message: string }> {
    const coupons = await this.getCoupons();
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or expired coupon code.' };
    }

    if (cartTotal < coupon.minOrderValue) {
      return { 
        valid: false, 
        discount: 0, 
        message: `Coupon requires minimum order of ₹${coupon.minOrderValue}.` 
      };
    }

    let discount = 0;
    if (coupon.type === 'flat') {
      discount = coupon.value;
    } else {
      discount = Math.round((cartTotal * coupon.value) / 100);
    }

    return { 
      valid: true, 
      discount, 
      message: `Coupon applied: ${coupon.description}` 
    };
  },

  // Settings
  async getSettings(): Promise<BusinessSettings> {
    return getStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async updateSettings(updates: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...updates };
    setStored(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // Wishlist
  getWishlist(): string[] {
    return getStored<string[]>(STORAGE_KEYS.WISHLIST, ['prod-001', 'prod-002']);
  },

  toggleWishlist(productId: string): boolean {
    const list = this.getWishlist();
    let isAdded = false;
    let nextList: string[];
    if (list.includes(productId)) {
      nextList = list.filter((id) => id !== productId);
    } else {
      nextList = [...list, productId];
      isAdded = true;
    }
    setStored(STORAGE_KEYS.WISHLIST, nextList);
    return isAdded;
  },
};
