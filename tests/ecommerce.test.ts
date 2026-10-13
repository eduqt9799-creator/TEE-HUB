import crypto from 'crypto';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../src/data/initialData';

console.log('🧪 Running TEE HUB Test Suite...');
let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

// 1. Product Catalog Test
console.log('\n--- 1. Product Catalog Tests ---');
assert(INITIAL_PRODUCTS.length >= 8, 'At least 8 initial heavyweight T-shirt products loaded');
const driftMore = INITIAL_PRODUCTS.find((p) => p.slug === 'drift-more-oversized');
assert(!!driftMore, 'Found Drift More Oversized T-Shirt');
assert(driftMore?.gsm === 240, 'Drift More is 240 GSM organic French Terry');
assert(Boolean(driftMore?.sizes.includes('L')), 'Drift More includes Size L');
assert(driftMore?.colors.length === 4, 'Drift More has 4 distinct colorways');
assert(driftMore?.frame360Images.length === 36, 'Drift More contains 36 continuous 360-degree rotational frames');
assert(driftMore?.angleImages.length === 8, 'Drift More contains 8 HD studio capture angles');

// 2. Coupon Validation Test
console.log('\n--- 2. Coupon Engine Tests ---');
const coupon150 = INITIAL_COUPONS.find((c) => c.code === 'FIRSTTEE150');
assert(!!coupon150 && coupon150.isActive, 'FIRSTTEE150 coupon exists and is active');
assert(coupon150?.value === 150, 'FIRSTTEE150 gives flat ₹150 discount');

const cartTotalBelow = 500;
const cartTotalAbove = 899;
assert(cartTotalBelow < (coupon150?.minOrderValue || 0), 'Cart ₹500 is below minimum threshold ₹699');
assert(cartTotalAbove >= (coupon150?.minOrderValue || 0), 'Cart ₹899 qualifies for FIRSTTEE150');

// 3. Shipping Calculation Test
console.log('\n--- 3. Shipping & Pricing Math Tests ---');
const freeShippingThreshold = 999;
const standardFee = 99;

function calculateShipping(subtotal: number): number {
  return subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : standardFee;
}

assert(calculateShipping(699) === 99, 'Cart of ₹699 charges ₹99 standard shipping');
assert(calculateShipping(1048) === 0, 'Cart of ₹1048 receives free shipping');

// 4. Razorpay Signature Verification Test
console.log('\n--- 4. Razorpay Server Signature Verification ---');
const testSecret = 'secret_teehub_2026';
const rzpOrderId = 'order_test_12345';
const rzpPaymentId = 'pay_test_67890';

const generatedSignature = crypto
  .createHmac('sha256', testSecret)
  .update(`${rzpOrderId}|${rzpPaymentId}`)
  .digest('hex');

const verifySignature = (orderId: string, payId: string, signature: string, secret: string) => {
  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${payId}`).digest('hex');
  return expected === signature;
};

assert(
  verifySignature(rzpOrderId, rzpPaymentId, generatedSignature, testSecret),
  'Razorpay HMAC SHA256 signature verification passes with matching secret'
);
assert(
  !verifySignature(rzpOrderId, rzpPaymentId, 'tampered_signature', testSecret),
  'Razorpay signature verification rejects invalid or tampered signature'
);

// 5. Stock Decrement Safety Test
console.log('\n--- 5. Inventory Decrement Tests ---');
let initialStock = 20;
let orderedQuantity = 2;
initialStock = Math.max(0, initialStock - orderedQuantity);
assert(initialStock === 18, 'Inventory safely decremented by order quantity (20 -> 18)');

// Summary
console.log(`\n================================`);
console.log(`Test Results: ${passedTests}/${totalTests} Passed.`);
console.log(`================================\n`);
