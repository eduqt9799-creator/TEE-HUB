import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { AnnouncementBar } from './AnnouncementBar';

interface HeaderProps {
  onOpenSearch: () => void;
  announcementText?: string;
  announcementSubtext?: string;
  announcementActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  announcementText,
  announcementSubtext,
  announcementActive,
}) => {
  const { cartCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout, setIsAuthModalOpen } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Oversized', path: '/shop?category=Oversized' },
    { label: 'Graphic Tees', path: '/shop?category=Graphic+Tees' },
    { label: 'Minimalist', path: '/shop?category=Minimalist' },
    { label: 'New Arrivals', path: '/shop?tag=new' },
    { label: 'About Us', path: '/about' },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-40">
      <AnnouncementBar
        text={announcementText}
        subtext={announcementSubtext}
        active={announcementActive}
      />
      <header className="w-full bg-[#fbf9f6]/95 backdrop-blur-xl border-b border-[#e5e0d8] shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-all">
        <div className="h-20 max-w-[1440px] mx-auto px-4 md:px-12 flex items-center justify-between gap-4">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex flex-col group select-none">
              <span className="font-display text-2xl tracking-tighter font-extrabold text-[#111111] leading-none uppercase">
                TEE HUB
              </span>
              <span className="text-[10px] tracking-widest text-[#5f615e] uppercase mt-0.5 font-medium">
                Find Your Fit. Own Your Style.
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-normal whitespace-nowrap transition-colors py-1 ${
                    isActive(link.path)
                      ? 'text-[#111111] font-bold border-b-2 border-[#111111]'
                      : 'text-[#5f615e] font-medium hover:text-[#111111]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Action Icons & Search */}
          <div className="flex items-center gap-3 flex-1 max-w-md justify-end">
            {/* Search Input on Desktop */}
            <div className="relative w-full max-w-xs hidden lg:block">
              <button
                type="button"
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between bg-[#f5f3f0] hover:bg-[#eae8e5] px-3.5 py-2 rounded text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-[#5f615e]">
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span className="text-xs">Search oversized, graphics...</span>
                </div>
                <kbd className="text-[10px] font-mono bg-[#e4e2df] text-[#444748] px-1.5 py-0.5 rounded uppercase select-none">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="lg:hidden p-2 text-[#5f615e] hover:text-[#111111] hover:bg-[#f5f3f0] rounded transition-colors"
              title="Search"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>

            {/* Currency Pill */}
            <div className="hidden sm:flex items-center gap-1 bg-[#f5f3f0] px-2.5 py-1.5 rounded text-xs select-none">
              <span className="font-semibold text-[#111111]">₹</span>
              <span className="text-[10px] font-bold text-[#5f615e] tracking-wider uppercase">INR</span>
            </div>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 text-[#5f615e] hover:text-[#111111] hover:bg-[#f5f3f0] rounded transition-colors"
              title="View Wishlist"
            >
              <span className="material-symbols-outlined text-[22px]">favorite</span>
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#58614e] text-white text-[9px] flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-1.5 bg-[#efeeeb] hover:bg-[#eae8e5] px-3 py-2 rounded transition-colors text-xs font-bold text-[#111111]"
              title="View Shopping Bag"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span className="tabular-nums font-bold text-sm">{cartCount}</span>
            </button>

            {/* User Account / Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="w-9 h-9 rounded-full bg-[#111111] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="Account Menu"
              >
                <span className="material-symbols-outlined text-[19px]">person</span>
              </button>

              {accountDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-[#e5e0d8] py-2 z-50 text-xs"
                  onClick={() => setAccountDropdownOpen(false)}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-[#f5f3f0]">
                        <p className="font-bold text-[#111111] truncate">{user?.name}</p>
                        <p className="text-[#5f615e] truncate text-[11px]">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 bg-[#dce6cd] text-[#414a37] text-[10px] font-bold px-1.5 py-0.5 rounded">
                            ADMIN ACCESS
                          </span>
                        )}
                      </div>
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-[#111111] hover:bg-[#f5f3f0] transition-colors"
                      >
                        My Account &amp; Addresses
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-[#111111] hover:bg-[#f5f3f0] transition-colors"
                      >
                        Order History &amp; Tracking
                      </Link>
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-[#58614e] font-bold hover:bg-[#f5f3f0] transition-colors"
                      >
                        ⚡ Admin Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-[#ba1a1a] hover:bg-[#f5f3f0] transition-colors border-t border-[#f5f3f0]"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-[#f5f3f0]">
                        <p className="font-bold text-[#111111]">Welcome to TEE HUB</p>
                        <p className="text-[#5f615e] text-[11px]">Sign in to track orders &amp; access drops</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAuthModalOpen(true)}
                        className="w-full text-left px-4 py-2.5 font-bold text-[#111111] hover:bg-[#f5f3f0] transition-colors"
                      >
                        Sign In / Register
                      </button>
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-[#58614e] font-bold hover:bg-[#f5f3f0] transition-colors border-t border-[#f5f3f0]"
                      >
                        Enter Admin Mode
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#111111] hover:bg-[#f5f3f0] rounded transition-colors"
              title="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[#e5e0d8] bg-white px-6 py-4 animate-fadeIn">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm py-2 px-3 rounded transition-colors ${
                    isActive(link.path)
                      ? 'bg-[#111111] text-white font-bold'
                      : 'text-[#111111] hover:bg-[#f5f3f0]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-[#f5f3f0] flex items-center justify-between">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-[#58614e] py-1"
                >
                  Admin Management
                </Link>
                <span className="text-xs text-[#858383]">INR Currency</span>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};
