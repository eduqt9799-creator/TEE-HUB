import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { api, initLocalStorage } from './services/api';
import { BusinessSettings } from './types';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { AuthModal } from './components/common/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboard } from './pages/AdminDashboard';

// Cart Toast Component
const CartToast: React.FC = () => {
  const { showToast, lastAddedItem, dismissToast } = useCart();

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showToast, dismissToast]);

  if (!showToast || !lastAddedItem) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3.5 rounded-lg shadow-2xl flex items-center gap-3 animate-fadeIn border border-white/10">
      <span className="material-symbols-outlined text-[#dce6cd] text-[22px]">
        check_circle
      </span>
      <div className="flex flex-col text-xs">
        <span className="font-bold">Added to Cart!</span>
        <span className="text-[#c4c7c7] text-[11px]">
          {lastAddedItem.productName} ({lastAddedItem.size} • {lastAddedItem.color})
        </span>
      </div>
      <button
        type="button"
        onClick={dismissToast}
        className="ml-2 text-white/60 hover:text-white"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};

const NotFoundPage: React.FC = () => (
  <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-32 text-center">
    <span className="font-display font-extrabold text-6xl text-[#111111] block mb-2">404</span>
    <h1 className="font-display font-bold text-xl uppercase text-[#111111] mb-2">
      Silhouette Not Found
    </h1>
    <p className="text-xs text-[#5f615e] max-w-sm mx-auto mb-6">
      The drop you are looking for has been archived or does not exist.
    </p>
    <Link
      to="/"
      className="inline-block bg-[#111111] text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#262626]"
    >
      Return to Storefront
    </Link>
  </div>
);

const AppContent: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    initLocalStorage();
    api.getSettings().then(setSettings);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with Sticky Behavior and Nav */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        announcementText={settings?.announcementText}
        announcementSubtext={settings?.announcementSubtext}
        announcementActive={settings?.announcementActive}
      />

      {/* Main Content Area: offset 28 spacing for fixed header */}
      <main className="flex-1 w-full pt-28">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
          <Route path="/orders" element={<OrderTrackingPage />} />
          <Route path="/orders/:id" element={<OrderTrackingPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/wishlist" element={<AccountPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Overlays & Modals */}
      <CartDrawer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal />
      <CartToast />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
