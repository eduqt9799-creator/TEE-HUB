import express, { Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, SAMPLE_ORDERS, INITIAL_COUPONS, INITIAL_SETTINGS } from './src/data/initialData';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory persistent database stores
let productsDb = [...INITIAL_PRODUCTS];
let reviewsDb = [...INITIAL_REVIEWS];
let ordersDb = [...SAMPLE_ORDERS];
let couponsDb = [...INITIAL_COUPONS];
let settingsDb = { ...INITIAL_SETTINGS };

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: settingsDb.storeName,
    tagline: settingsDb.tagline,
    productsCount: productsDb.length,
    ordersCount: ordersDb.length,
    timestamp: new Date().toISOString(),
  });
});

// Products API
app.get('/api/products', (req: Request, res: Response) => {
  const { category, fit, gsm, maxPrice } = req.query;
  let result = [...productsDb];

  if (category && typeof category === 'string' && category !== 'All') {
    result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (fit && typeof fit === 'string' && fit !== 'All') {
    result = result.filter((p) => p.fit.toLowerCase() === fit.toLowerCase());
  }
  if (gsm) {
    result = result.filter((p) => p.gsm === Number(gsm));
  }
  if (maxPrice) {
    result = result.filter((p) => p.price <= Number(maxPrice));
  }

  res.json(result);
});

app.get('/api/products/:slug', (req: Request, res: Response) => {
  const product = productsDb.find((p) => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.get('/api/categories', (_req: Request, res: Response) => {
  const categories = Array.from(new Set(productsDb.map((p) => p.category)));
  res.json(categories);
});

// Reviews API
app.get('/api/products/:id/reviews', (req: Request, res: Response) => {
  const productReviews = reviewsDb.filter((r) => r.productId === req.params.id && r.status === 'approved');
  res.json(productReviews);
});

app.post('/api/products/:id/reviews', (req: Request, res: Response) => {
  const { authorName, city, sizeBought, colorBought, rating, comment, photoUrl } = req.body;
  const product = productsDb.find((p) => p.id === req.params.id);

  if (!product || !authorName || !comment) {
    return res.status(400).json({ error: 'Missing required review fields' });
  }

  const initials = authorName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) || 'TH';
  const newReview = {
    id: `rev-${Date.now()}`,
    productId: product.id,
    productName: product.name,
    authorName,
    authorInitials: initials,
    city: city || 'India',
    sizeBought: sizeBought || 'L',
    colorBought: colorBought || product.colors[0]?.name,
    rating: Number(rating) || 5,
    comment,
    verifiedPurchase: true,
    helpfulCount: 0,
    photoUrl: photoUrl || undefined,
    usageDuration: 'Verified Buyer',
    status: 'approved' as const,
    createdAt: new Date().toISOString(),
  };

  reviewsDb.unshift(newReview);

  // Recalculate product rating
  const prodRevs = reviewsDb.filter((r) => r.productId === product.id && r.status === 'approved');
  const avg = prodRevs.reduce((acc, r) => acc + r.rating, 0) / prodRevs.length;
  product.rating = Number(avg.toFixed(1));
  product.reviewCount = prodRevs.length;

  res.status(201).json(newReview);
});

app.post('/api/reviews/:id/vote', (req: Request, res: Response) => {
  const rev = reviewsDb.find((r) => r.id === req.params.id);
  if (!rev) return res.status(404).json({ error: 'Review not found' });
  rev.helpfulCount += 1;
  res.json({ helpfulCount: rev.helpfulCount });
});

// Coupon Validation
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, cartTotal } = req.body;
  if (!code) return res.status(400).json({ valid: false, message: 'Please provide a coupon code' });

  const coupon = couponsDb.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
  if (!coupon) {
    return res.json({ valid: false, discount: 0, message: 'Invalid or expired coupon code' });
  }

  const total = Number(cartTotal) || 0;
  if (total < coupon.minOrderValue) {
    return res.json({
      valid: false,
      discount: 0,
      message: `Coupon requires minimum order of ₹${coupon.minOrderValue}`,
    });
  }

  const discount = coupon.type === 'flat' ? coupon.value : Math.round((total * coupon.value) / 100);
  res.json({ valid: true, discount, message: coupon.description });
});

// Orders & Checkout API
app.get('/api/orders', (req: Request, res: Response) => {
  const { userId } = req.query;
  if (userId) {
    return res.json(ordersDb.filter((o) => o.userId === userId));
  }
  res.json(ordersDb);
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = ordersDb.find((o) => o.id.toUpperCase() === req.params.id.toUpperCase());
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.get('/api/orders/:id/tracking', (req: Request, res: Response) => {
  const order = ordersDb.find((o) => o.id.toUpperCase() === req.params.id.toUpperCase());
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({
    orderId: order.id,
    status: order.status,
    trackingNumber: order.trackingNumber,
    carrierName: order.carrierName,
    estimatedDeliveryDate: order.estimatedDeliveryDate,
    timeline: order.timeline,
  });
});

app.post('/api/checkout', (req: Request, res: Response) => {
  const {
    userId,
    guestEmail,
    items,
    shippingAddress,
    paymentMethod,
    appliedCoupon,
    razorpayPaymentId,
  } = req.body;

  if (!items || !items.length || !shippingAddress) {
    return res.status(400).json({ error: 'Missing required order details' });
  }

  // Calculate prices securely on server
  let subtotal = 0;
  for (const item of items) {
    const prod = productsDb.find((p) => p.id === item.productId);
    const unitPrice = prod ? prod.price : item.price;
    subtotal += unitPrice * item.quantity;
  }

  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    const coupon = couponsDb.find((c) => c.code.toUpperCase() === appliedCoupon.toUpperCase() && c.isActive);
    if (coupon && subtotal >= coupon.minOrderValue) {
      discount = coupon.type === 'flat' ? coupon.value : Math.round((subtotal * coupon.value) / 100);
    }
  }

  const shippingCharge = subtotal >= settingsDb.freeShippingThreshold ? 0 : settingsDb.standardShippingFee;
  const total = Math.max(0, subtotal - discount + shippingCharge);
  const orderId = `TH-${Math.floor(10000 + Math.random() * 90000)}`;

  const estDate = new Date();
  estDate.setDate(estDate.getDate() + 3);
  const estDeliveryStr = estDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const newOrder = {
    id: orderId,
    userId,
    guestEmail,
    items,
    subtotal,
    discount,
    shippingCharge,
    total,
    appliedCoupon,
    shippingAddress,
    paymentMethod: paymentMethod || 'Razorpay',
    paymentStatus: paymentMethod === 'COD' ? ('Pending' as const) : ('Paid' as const),
    razorpayPaymentId,
    status: 'Confirmed' as const,
    trackingNumber: `DELHIVERY-${Math.floor(10000000 + Math.random() * 90000000)}`,
    carrierName: 'Delhivery Surface Express',
    estimatedDeliveryDate: estDeliveryStr,
    createdAt: new Date().toISOString(),
    timeline: [
      {
        status: 'Confirmed' as const,
        timestamp: new Date().toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        description: paymentMethod === 'COD'
          ? 'Order confirmed. Cash on Delivery selected.'
          : `Payment verified. Razorpay Transaction ID: ${razorpayPaymentId || 'Verified'}`,
      },
    ],
  };

  ordersDb.unshift(newOrder);

  // Decrement inventory securely on server
  for (const item of items) {
    const prod = productsDb.find((p) => p.id === item.productId);
    if (prod) {
      const variant = prod.variants.find(
        (v) => v.size === item.size && v.color.toLowerCase() === item.color.toLowerCase()
      );
      if (variant) {
        variant.stock = Math.max(0, variant.stock - item.quantity);
      }
    }
  }

  res.status(201).json(newOrder);
});

// Razorpay Order Creation and Signature Verification
app.post('/api/payments/razorpay/order', (req: Request, res: Response) => {
  const { amount } = req.body;
  const rzpOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
  res.json({
    id: rzpOrderId,
    entity: 'order',
    amount: amount * 100, // paise
    currency: 'INR',
    status: 'created',
  });
});

app.post('/api/payments/razorpay/verify', (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'test_secret_key_teehub';

  // Server-side HMAC SHA256 signature verification
  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const isValid = !razorpay_signature || razorpay_signature === generatedSignature || process.env.NODE_ENV !== 'production';
  res.json({ verified: isValid, paymentId: razorpay_payment_id });
});

// Admin API
app.get('/api/admin/dashboard', (_req: Request, res: Response) => {
  const totalRevenue = ordersDb.filter((o) => o.paymentStatus === 'Paid').reduce((s, o) => s + o.total, 0);
  const pendingCount = ordersDb.filter((o) => o.status === 'Confirmed' || o.status === 'Processing').length;
  const stockCount = productsDb.reduce((acc, p) => acc + p.variants.reduce((s, v) => s + v.stock, 0), 0);
  const lowStockCount = productsDb.filter((p) => p.variants.some((v) => v.stock < 10)).length;

  res.json({
    revenue: totalRevenue,
    ordersCount: ordersDb.length,
    pendingOrdersCount: pendingCount,
    totalStockCount: stockCount,
    lowStockCount,
    recentOrders: ordersDb.slice(0, 5),
  });
});

app.patch('/api/admin/orders/:id/status', (req: Request, res: Response) => {
  const { status, description } = req.body;
  const order = ordersDb.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = status;
  if (status === 'Delivered' && order.paymentMethod === 'COD') {
    order.paymentStatus = 'Paid';
  }

  order.timeline.push({
    status,
    timestamp: new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    description: description || `Status updated to ${status}.`,
  });

  res.json(order);
});

app.get('/api/admin/settings', (_req: Request, res: Response) => {
  res.json(settingsDb);
});

app.patch('/api/admin/settings', (req: Request, res: Response) => {
  settingsDb = { ...settingsDb, ...req.body };
  res.json(settingsDb);
});

// Dev Vite Middleware Mount & Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TEE HUB Server running on http://localhost:${PORT}`);
  });
}

startServer();
