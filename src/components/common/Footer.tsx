import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#f5f3f0] border-t border-[#e5e0d8] pt-14 pb-10 text-xs">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
          {/* Brand Info & Sustainability */}
          <div className="lg:col-span-2 flex flex-col pr-0 lg:pr-10">
            <Link to="/" className="flex flex-col mb-3">
              <span className="font-display text-2xl font-extrabold uppercase text-[#111111] leading-none">
                TEE HUB
              </span>
              <span className="text-[10px] tracking-widest text-[#5f615e] uppercase mt-1 font-semibold">
                Modern Streetwear Archetypes
              </span>
            </Link>
            <p className="text-sm text-[#5f615e] max-w-sm mb-4 leading-relaxed">
              Engineered for tactile longevity. Heavyweight drops, drop-shoulder geometry, and zero-compromise combed cotton crafted for the Indian contemporary landscape.
            </p>
            <div className="flex items-center gap-2 text-[#414a37] bg-[#dce6cd] p-3 rounded max-w-sm mb-4">
              <span className="material-symbols-outlined text-[18px]">eco</span>
              <span className="font-semibold text-[11px] uppercase tracking-wider">
                100% Plastic-Free &amp; Composable Cornstarch Packaging
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#111111]">
              <span className="w-8 h-8 rounded bg-[#eae8e5] flex items-center justify-center text-[#5f615e] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">public</span>
              </span>
              <span className="w-8 h-8 rounded bg-[#eae8e5] flex items-center justify-center text-[#5f615e] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              </span>
              <span className="w-8 h-8 rounded bg-[#eae8e5] flex items-center justify-center text-[#5f615e] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">chat</span>
              </span>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-[#111111] mb-4 text-[11px]">
              Collections
            </h4>
            <ul className="flex flex-col gap-2.5 text-[#5f615e]">
              <li>
                <Link to="/shop?category=Oversized" className="hover:text-[#111111] transition-colors">
                  Oversized Tees
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Graphic+Tees" className="hover:text-[#111111] transition-colors">
                  Vintage Graphic
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Minimalist" className="hover:text-[#111111] transition-colors">
                  Minimal Plain
                </Link>
              </li>
              <li>
                <Link to="/shop?gsm=280" className="hover:text-[#111111] transition-colors">
                  Heavyweight 280 GSM
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Acid+Wash" className="hover:text-[#111111] transition-colors">
                  Acid Wash Silhouettes
                </Link>
              </li>
              <li>
                <Link to="/shop?tag=new" className="hover:text-[#111111] transition-colors">
                  Latest Drops
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-[#111111] mb-4 text-[11px]">
              Concierge
            </h4>
            <ul className="flex flex-col gap-2.5 text-[#5f615e]">
              <li>
                <Link to="/orders" className="hover:text-[#111111] transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/about#milling" className="hover:text-[#111111] transition-colors">
                  Size Guide &amp; 360° Fit Finder
                </Link>
              </li>
              <li>
                <Link to="/about#returns" className="hover:text-[#111111] transition-colors">
                  7-Day Hassle-Free Returns
                </Link>
              </li>
              <li>
                <a href="https://wa.me/919820012345" target="_blank" rel="noreferrer" className="hover:text-[#111111] transition-colors">
                  Direct WhatsApp Concierge
                </a>
              </li>
              <li>
                <Link to="/about#care" className="hover:text-[#111111] transition-colors">
                  Garment Care Instructions
                </Link>
              </li>
              <li>
                <Link to="/admin" className="font-bold text-[#58614e] hover:underline">
                  Admin Control Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Inside The Drop */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-[#111111] mb-4 text-[11px]">
              Inside The Drop
            </h4>
            <p className="text-[#5f615e] mb-3 leading-relaxed">
              Receive priority access to limited volume batches and member-only secret links.
            </p>
            {subscribed ? (
              <div className="bg-[#dce6cd] text-[#414a37] p-3 rounded font-medium text-xs">
                ✓ You're on the list! Use code <strong className="font-bold">FIRSTTEE150</strong> for ₹150 off.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mb-3">
                <div className="flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="bg-white border border-[#e5e0d8] px-3 py-2 rounded-l text-xs w-full focus:outline-none focus:border-[#111111] placeholder:text-[#858383]"
                  />
                  <button
                    type="submit"
                    className="bg-[#111111] text-white font-bold px-4 py-2 rounded-r hover:bg-[#262626] transition-colors shrink-0"
                  >
                    Join
                  </button>
                </div>
                <label className="flex items-start gap-1.5 cursor-pointer mt-0.5 text-[11px] text-[#5f615e]">
                  <input type="checkbox" defaultChecked className="mt-0.5 accent-[#111111] rounded" />
                  <span>I agree to receive streetwear updates &amp; early release invites.</span>
                </label>
              </form>
            )}
            <div className="flex items-center gap-1.5 text-[#5f615e] bg-[#eae8e5] px-2.5 py-1 rounded w-fit">
              <span className="material-symbols-outlined text-[15px]">lock</span>
              <span className="font-bold uppercase tracking-wider text-[10px]">
                Razorpay 100% Encrypted
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Payment Badges */}
        <div className="pt-6 border-t border-[#e5e0d8] flex flex-col md:flex-row items-center justify-between gap-4 text-[#5f615e]">
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>© 2026 TEE HUB APPAREL PVT LTD. All rights reserved.</span>
            <Link to="/about" className="hover:text-[#111111] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-[#111111] transition-colors">
              Terms of Service
            </Link>
          </div>
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
            <span>UPI • RuPay • Visa • Mastercard • NetBanking • COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
