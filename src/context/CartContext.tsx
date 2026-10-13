import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, ProductSize, Product } from '../types';
import { api } from '../services/api';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: ProductSize, color: string, colorHex: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  shippingCharge: number;
  total: number;
  appliedCoupon: string | null;
  couponMessage: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  cartCount: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  lastAddedItem: CartItem | null;
  showToast: boolean;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'teehub_cart_items_v1';
const COUPON_STORAGE_KEY = 'teehub_cart_coupon_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      // Pre-seed 2 items matching the visual header badge in the mockup
      return [
        {
          id: 'cart-sample-1',
          productId: 'prod-001',
          productName: 'Drift More Oversized T-Shirt',
          slug: 'drift-more-oversized',
          price: 899,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtT1n7LBSCxKab6XbwJ3Iq4ASwJD1qfeZzzHGEv0xFg6RVoui74Pwm1VC-yO976FlMCJtwYY-j9bTycXh4J6yGxAlYSaErjO0x9siC4YbATmLxs8qE7lZ7k9SumASJO7tqCca-eDRXiJC2LuyxkpaNf2UYpAAR9GjjHvhxZdPpsN1v68zCDxRDSwA7uR8vWK566BR1v4c66jo0LdJ_HH4_OABHxW5julaGdfAl1cv040iJ1R2kaGUh',
          size: 'L',
          color: 'Off-White Canvas',
          colorHex: '#F5F2EB',
          quantity: 1,
          gsm: 240,
          fit: 'Oversized',
        },
        {
          id: 'cart-sample-2',
          productId: 'prod-002',
          productName: 'Better Days Ahead',
          slug: 'better-days-ahead',
          price: 699,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_FPSm4X9zAYwDVQFbJ502kc4VOaVOmkXgzek6PRjDDE26cQVkDYZgSKonC1VuD7JgLogNSsPEPVliXt1KiEn0ALYoqpbjnslo3aAahe-tAlgvY-z4I9XPWRBzxR8jHDkND-epEoW76T_T90qoWSM3Ys3sf1KT9-Ru8oAwxp-2Z9JZ78wePfeokjXk2MmYwo0mL6PzsD5MPqoiUb5P2f-Jp9lJi-mVmn4Liu_5mrimMaCb4MHDWwBk',
          size: 'M',
          color: 'Jet Black',
          colorHex: '#1B1C1A',
          quantity: 1,
          gsm: 240,
          fit: 'Oversized',
        },
      ];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    return localStorage.getItem(COUPON_STORAGE_KEY) || null;
  });
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(999);
  const [standardShippingFee, setStandardShippingFee] = useState<number>(99);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);

  // Sync with business settings
  useEffect(() => {
    api.getSettings().then((settings) => {
      setFreeShippingThreshold(settings.freeShippingThreshold);
      setStandardShippingFee(settings.standardShippingFee);
    });
  }, []);

  // Save items to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error(err);
    }
  }, [items]);

  // Subtotal calculation
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Re-verify coupon discount on cart change
  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      api.validateCoupon(appliedCoupon, subtotal).then((res) => {
        if (res.valid) {
          setCouponDiscount(res.discount);
          setCouponMessage(res.message);
        } else {
          setCouponDiscount(0);
          setCouponMessage(res.message);
        }
      });
    } else {
      setCouponDiscount(0);
      setCouponMessage(null);
    }
  }, [appliedCoupon, subtotal]);

  const shippingCharge = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : standardShippingFee;
  const discount = Math.min(couponDiscount, subtotal);
  const total = Math.max(0, subtotal - discount + shippingCharge);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const addItem = (
    product: Product,
    size: ProductSize,
    color: string,
    colorHex: string,
    quantity = 1
  ) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === product.id && i.size === size && i.color === color
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        setLastAddedItem(next[existingIndex]);
        return next;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        productName: product.name,
        slug: product.slug,
        price: product.price,
        image: product.thumbnail,
        size,
        color,
        colorHex,
        quantity,
        gsm: product.gsm,
        fit: product.fit,
      };
      setLastAddedItem(newItem);
      return [...prev, newItem];
    });

    setShowToast(true);
  };

  const dismissToast = () => setShowToast(false);

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    removeCoupon();
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const res = await api.validateCoupon(code, subtotal);
    if (res.valid) {
      setAppliedCoupon(code.toUpperCase());
      setCouponDiscount(res.discount);
      setCouponMessage(res.message);
      localStorage.setItem(COUPON_STORAGE_KEY, code.toUpperCase());
      return true;
    } else {
      setCouponMessage(res.message);
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponMessage(null);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        shippingCharge,
        total,
        appliedCoupon,
        couponMessage,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartCount,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        lastAddedItem,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
