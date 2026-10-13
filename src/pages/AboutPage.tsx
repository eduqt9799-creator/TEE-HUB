import React from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full bg-[#fbf9f6] min-h-screen py-12">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-12">
        {/* Hero Banner */}
        <div className="max-w-3xl mb-16">
          <span className="text-[11px] uppercase tracking-widest text-[#58614e] font-bold">
            The Philosophy &amp; Architecture
          </span>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-[#111111] uppercase tracking-tight mt-2 mb-4 leading-tight">
            Built For Your Everyday.<br />
            Engineered For The Long Run.
          </h1>
          <p className="text-sm md:text-base text-[#5f615e] leading-relaxed">
            At TEE HUB, we rejected fast-fashion flimsiness. Most t-shirts wrinkle into paper napkins after a few washes because they are made with cut-rate carded cotton and light yarn counts.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20" id="milling">
          <div className="bg-white p-6 md:p-8 rounded-xl border border-[#e5e0d8] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded bg-[#f5f3f0] flex items-center justify-center text-[#111111] mb-4 border border-[#e5e0d8]">
                <span className="material-symbols-outlined text-[24px]">architecture</span>
              </div>
              <h3 className="font-display font-bold text-lg text-[#111111] mb-2 uppercase">
                240 GSM French Terry
              </h3>
              <p className="text-xs text-[#5f615e] leading-relaxed">
                Custom knitted in Tirupur, India, using long-staple combed cotton fibers. Delivers a sculptured, drop-shoulder boxy drape that hangs cleanly without clinging.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f5f3f0] text-[11px] font-bold text-[#58614e] uppercase">
              Zero Pilling • Pre-Shrunk
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl border border-[#e5e0d8] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded bg-[#f5f3f0] flex items-center justify-center text-[#111111] mb-4 border border-[#e5e0d8]">
                <span className="material-symbols-outlined text-[24px]">science</span>
              </div>
              <h3 className="font-display font-bold text-lg text-[#111111] mb-2 uppercase">
                OEKO-TEX Botanical Dyes
              </h3>
              <p className="text-xs text-[#5f615e] leading-relaxed">
                Zero harmful chemicals or harsh mordants. We utilize certified reactive botanical dyes tested against 50 high-temperature laundry cycles to ensure vibrant zero-fade depth.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f5f3f0] text-[11px] font-bold text-[#58614e] uppercase">
              Skin-Safe • 100% Breathable
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl border border-[#e5e0d8] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded bg-[#f5f3f0] flex items-center justify-center text-[#111111] mb-4 border border-[#e5e0d8]">
                <span className="material-symbols-outlined text-[24px]">straighten</span>
              </div>
              <h3 className="font-display font-bold text-lg text-[#111111] mb-2 uppercase">
                Anti-Bacon Collar Rib
              </h3>
              <p className="text-xs text-[#5f615e] leading-relaxed">
                Most crew necks bacon-ripple after one wash. Our collar ribs are lined with 5% LYCRA spandex with twin-needle reinforced stitching to stay crisp for years.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f5f3f0] text-[11px] font-bold text-[#58614e] uppercase">
              1.25" Heavy Crew Neck
            </div>
          </div>
        </div>

        {/* Policies & Assurance Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Returns & Exchange */}
          <div className="bg-white p-6 md:p-8 rounded-xl border border-[#e5e0d8] shadow-sm" id="returns">
            <h3 className="font-display font-bold text-base text-[#111111] uppercase mb-3">
              7-Day Hassle-Free Returns &amp; Exchanges
            </h3>
            <p className="text-xs text-[#5f615e] leading-relaxed mb-4">
              We stand behind our silhouettes 100%. If the drop shoulder fit is too loose or you'd prefer another colorway, request an exchange within 7 days of doorstep delivery. Our courier handles pickup directly from your address.
            </p>
            <ul className="text-xs text-[#5f615e] space-y-2">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#58614e] text-[16px]">check</span>
                <span>Unwashed garments with original tags intact.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#58614e] text-[16px]">check</span>
                <span>Zero questions asked size exchange within 48 hours.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#58614e] text-[16px]">check</span>
                <span>Instant refund to source account on verified returns.</span>
              </li>
            </ul>
          </div>

          {/* Garment Care Instructions */}
          <div className="bg-white p-6 md:p-8 rounded-xl border border-[#e5e0d8] shadow-sm" id="care">
            <h3 className="font-display font-bold text-base text-[#111111] uppercase mb-3">
              Garment Care Instructions
            </h3>
            <p className="text-xs text-[#5f615e] leading-relaxed mb-4">
              Our 240 GSM organic French Terry is engineered to soften with age while retaining its structured boxy shape.
            </p>
            <ul className="text-xs text-[#5f615e] space-y-2">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#58614e] text-[16px]">check</span>
                <span>Wash cold (30°C) inside out with mild liquid detergent.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#58614e] text-[16px]">check</span>
                <span>Hang dry in shade to preserve color richness.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#58614e] text-[16px]">check</span>
                <span>Do not iron directly over high-density puff screenprints.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-[#111111] text-white p-8 md:p-12 rounded-2xl">
          <h2 className="font-display font-extrabold text-2xl md:text-3xl uppercase mb-2">
            Experience The Difference
          </h2>
          <p className="text-xs md:text-sm text-[#c4c7c7] max-w-md mx-auto mb-6">
            Join over 50,000 streetwear enthusiasts across India wearing TEE HUB drops.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-[#111111] px-8 py-3.5 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#efeeeb] transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </div>
  );
};
