import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [fabricAngle, setFabricAngle] = useState<{
    label: string;
    image: string;
  }>({
    label: 'Front Facing',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEac8IdMtePuO0Yv8iF15NrcS8H5W1SrhWJKOgIlUIOwvnzIunKuLDF9VASFf2F6hQ84ZQN_oSlSPwteuIEqPupI6Vz9G-JFDEzS9smcw0hJM9DW9eCkPq8NCqIVgivWMCeiZ-ncD9aJAgVildk0hlj43MVrHtCzEasFO9RZbVsQrMLByIJT0LDTKF8MyFIAA1i7x4DadEwLm_bX_weI5JGY6e11705jfFg0Dna3YuuHxUeOn-dMYU',
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterClaimed, setNewsletterClaimed] = useState(false);

  useEffect(() => {
    api.getProducts().then(setProducts);
  }, []);

  const featuredProducts = products.filter((p) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'oversized') return p.category === 'Oversized' || p.fit === 'Oversized';
    if (filterCategory === 'graphics') return p.category === 'Graphic Tees' || p.category === 'Vintage Graphic';
    if (filterCategory === 'acid-wash') return p.category === 'Acid Wash';
    return true;
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterClaimed(true);
      navigator.clipboard?.writeText('FIRSTTEE150');
    }
  };

  const angleOptions = [
    {
      label: 'Front Facing',
      tabText: 'Front 0°',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEac8IdMtePuO0Yv8iF15NrcS8H5W1SrhWJKOgIlUIOwvnzIunKuLDF9VASFf2F6hQ84ZQN_oSlSPwteuIEqPupI6Vz9G-JFDEzS9smcw0hJM9DW9eCkPq8NCqIVgivWMCeiZ-ncD9aJAgVildk0hlj43MVrHtCzEasFO9RZbVsQrMLByIJT0LDTKF8MyFIAA1i7x4DadEwLm_bX_weI5JGY6e11705jfFg0Dna3YuuHxUeOn-dMYU',
    },
    {
      label: 'Drop Shoulder Profile',
      tabText: 'Side 90°',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtkUKraJQtie_zAg5tpBKQeZLOutWvh46_pUj5tAru-Y0xH33f2MsXUBI_IHkVdEvYIEX2ScCilAwAXzjO3fG5yUuiNQQ60cyBgVZzPEm-W1LPa6JjLLNed2jP2O4XyCbDQ3Px-fn8IekG4CNhKqga0abjYirJOS44bP1ECQT0ftQHinuLp2Y4HlV7D9e9itPZvSalEbJats8a2MTtFZo_LX22Co8SoQ2zSt4CG75Xb3Bh2bBC55gY',
    },
    {
      label: 'Back Artwork Details',
      tabText: 'Back 180°',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByWhtsleLznyqlvLiPbvKQmw-3HHU9Quz32kOcPogR6PCQaVWx-ehO2YnjydnPQY_p4Da4qFx-t6iLCFzabJHZmTvZeZto_hD09AqNKG5yvYrGke24N2jNvs3YwLKByIvKtSlAJUN3h8j-9rT-dpZXS5Do1qT_bJbIBtH5sBIpYffa25xOXaFy5aG4XhBsJJpnye0E1PUnb6kxyVOL9PTcthoV4WyvgswRj3Qa_PDfXPqp0ZN-9QbZ',
    },
    {
      label: '240 GSM Weave Macro Close-up',
      tabText: 'Fabric Macro',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2e1tMkbc6EDdHIFTp-BBe1f68PurSYKYxPw3x33BMcDS3_m86eMvokvuFvUah90RVG14EaWmYM0ggYZ-GSbVUzLFWqF1GnY55ThFaVdyXrumOi3gdJzjpuFSG_bkiB_c7Nh8yAUBX3QFreCisBaHreVgH9Eg8PAnvWPaiXx4KkAdwKey5aHs9rGPjjdGGJQbMzCsbgXpYvCW8vVBsFK8pxOoIH8sPkR1co61eAp2_8u4R-CqSqL0X',
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION WITH CINEMATIC HANGING RACK SHOWCASE */}
      <section className="relative w-full bg-[#000000] overflow-hidden text-white min-h-[640px] flex items-center">
        {/* Background Clothes Rack Photography */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen scale-105 pointer-events-none transition-transform duration-1000 ease-out">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjA-wc-GTuBL_q3fZ8A4bwbu9iZJmz1EiEE4aqES3UBNxNEFWRWxLwqprgrVfVtE0rCsQAm3TySKJ2FcVyYP-aL4Yv7NDQYIpy-x4alimAID1PohPLqYXsBtKsHMCVJZu-I87_KlRIal2yy5m4Vi2xNpjWAI5-qC-McVtJcwCvIWytVfJyNB58Z3rA6aRDWv3jWIktLZAfmRl82TNSjoKRbMj-6eXFcYyAX9c058rSPK73K7m2vRUb')`,
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10 pointer-events-none" />

        <div className="relative z-20 max-w-[1440px] mx-auto px-4 md:px-12 py-24 md:py-32 flex flex-col justify-center w-full">
          <div className="max-w-2xl flex flex-col items-start">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded mb-4 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#dce6cd] animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-white">
                Drop 04 // Spring-Summer 2026
              </span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="font-display text-4xl md:text-6xl tracking-tight text-white uppercase leading-tight font-extrabold mb-4">
              Wear Your Vibe.<br />
              <span className="text-[#e4e2df]">Premium T-Shirts</span><br />
              For Every Mood.
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-base text-[#c4c7c7] max-w-lg mb-8 leading-relaxed">
              Crafted with 240 GSM organic French Terry cotton and drop-shoulder geometry. Ultra-breathable, heavy-drape street silhouettes made to outlast seasons.
            </p>

            {/* Call to action buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#111111] font-bold text-xs uppercase tracking-wider px-8 py-4 rounded shadow-xl hover:bg-[#efeeeb] transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Shop Collection</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <a
                href="#fabric-spec"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs uppercase tracking-wider px-6 py-4 rounded backdrop-blur-md border border-white/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#dce6cd]">view_in_ar</span>
                <span>360° Fit Spec</span>
              </a>
            </div>

            {/* Trust feature points */}
            <div className="mt-10 pt-6 border-t border-white/15 flex flex-wrap items-center gap-6 text-[#eae8e5] text-xs">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#dce6cd]">verified</span>
                <span className="uppercase tracking-wider font-semibold text-[11px]">240 GSM Combed Cotton</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#dce6cd]">check_circle</span>
                <span className="uppercase tracking-wider font-semibold text-[11px]">Anti-Shrink Washed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#dce6cd]">local_fire_department</span>
                <span className="uppercase tracking-wider font-semibold text-[11px]">Zero-Fade High Res Print</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST & VALUE PROPOSITION TICKER BAR */}
      <section className="w-full bg-[#f5f3f0] py-6 border-b border-[#e5e0d8]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-2">
              <div className="w-11 h-11 rounded bg-white flex items-center justify-center text-[#111111] shadow-sm shrink-0 border border-[#e5e0d8]">
                <span className="material-symbols-outlined text-[22px]">local_shipping</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xs text-[#111111] uppercase tracking-wide leading-tight">Fast Shipping</span>
                <span className="text-[11px] text-[#5f615e]">Pan-India within 48-72h</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-11 h-11 rounded bg-white flex items-center justify-center text-[#111111] shadow-sm shrink-0 border border-[#e5e0d8]">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xs text-[#111111] uppercase tracking-wide leading-tight">100% Secure</span>
                <span className="text-[11px] text-[#5f615e]">UPI, COD &amp; Razorpay Safe</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-11 h-11 rounded bg-white flex items-center justify-center text-[#111111] shadow-sm shrink-0 border border-[#e5e0d8]">
                <span className="material-symbols-outlined text-[22px]">replay</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xs text-[#111111] uppercase tracking-wide leading-tight">7-Day Free Return</span>
                <span className="text-[11px] text-[#5f615e]">Instant doorstep exchanges</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-11 h-11 rounded bg-white flex items-center justify-center text-[#111111] shadow-sm shrink-0 border border-[#e5e0d8]">
                <span className="material-symbols-outlined text-[22px]">spa</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xs text-[#111111] uppercase tracking-wide leading-tight">100% Combed Cotton</span>
                <span className="text-[11px] text-[#5f615e]">Soft, bio-washed &amp; breathable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY MOSAIC */}
      <section className="w-full py-12 md:py-16 bg-[#fbf9f6]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#5f615e] font-semibold">
                Curated Silhouettes
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#111111] uppercase tracking-tight">
                Shop By Category
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#111111] hover:text-[#58614e] transition-colors group"
            >
              <span>View All Drops</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category 1: Oversized */}
            <Link
              to="/shop?category=Oversized"
              className="group relative block overflow-hidden rounded-xl bg-[#f5f3f0] shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e5e0d8]"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#efeeeb]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOOzRnCHJNYmnkuCZDMgWcQCHYsI2Aq9UkDcSEHaOHvai-tk3rsM1WSR2uQwYJCH04keuOb8nCwwBBWyQ_4U5ieKDNh1QBf1lt1tFzMoHnduYyokoe6qXcC2q9zAEo1kCiTt9x4GWkXc08Z6U7qSBBWNFlA54mPqG8fYI7M60Ah_A-7VMZQlc4UXIdvwTu9heIi5FdoyIFSopcE4YwEZ8JO580E7uIqUZ-ccZIOqdFrFL4nt3CX62u"
                  alt="Oversized Tees"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#dce6cd]">Fit 01</span>
                  <h3 className="font-display font-bold text-lg text-white">Oversized Tees</h3>
                  <p className="text-xs text-[#e4e2df]">Relaxed fit. Bigger vibes.</p>
                </div>
                <div className="w-8 h-8 rounded bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#111111] transition-colors">
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </div>
              </div>
            </Link>

            {/* Category 2: Graphic Tees */}
            <Link
              to="/shop?category=Graphic+Tees"
              className="group relative block overflow-hidden rounded-xl bg-[#f5f3f0] shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e5e0d8]"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#efeeeb]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuACyisVzgxj6pIO0G38tiu7lzSsqwjf_MU0g8s4-46hPqKdGGSp1YCH3jAn1wUUVRNzCAO0JIis-KPqgWH9FdQpHA_DeIpSJgsiJnFcQ1TMU0GFa8WZ2U_FHMhzBDac36wgUhHAcX3mj-8wD2pzXtjirk3cYiL_L-QuwTxs9B00eaVitxP-uIcbxRriog6YGRXmgmcj28ZBjINUutEh1iwBhLB8Db2kptxystiuyFaVUs2l83Ef6wP0"
                  alt="Graphic Tees"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#dce6cd]">Drop 02</span>
                  <h3 className="font-display font-bold text-lg text-white">Graphic Tees</h3>
                  <p className="text-xs text-[#e4e2df]">Bold prints. Unique you.</p>
                </div>
                <div className="w-8 h-8 rounded bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#111111] transition-colors">
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </div>
              </div>
            </Link>

            {/* Category 3: Minimalist Plain */}
            <Link
              to="/shop?category=Minimalist"
              className="group relative block overflow-hidden rounded-xl bg-[#f5f3f0] shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e5e0d8]"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#efeeeb]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4e3yg6DuCp5XTR6yZWYc37vuJuej_4yIaBkZCCbSsqBUZ6RSXRw6D5JI5QAyypDZ74a36cMOnVTu7CqdK6syYRsLnff9Mno5k3u8C6UGi_UcXX-w2TjtX6J86ez2mtSRauQZMuPiz14Kl-GEBpfAP7GxVj2qkmR_tC97l6ULIokDfkhlK8Xz4a5ksdl0nFDey-O9Tlk4--hsgck1rVYwAT5V1qnTj9q9FXR2qmK70nLxTIHD6aNVL"
                  alt="Minimalist Plain"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#dce6cd]">Archetype 03</span>
                  <h3 className="font-display font-bold text-lg text-white">Minimalist Plain</h3>
                  <p className="text-xs text-[#e4e2df]">Pure cotton essentials.</p>
                </div>
                <div className="w-8 h-8 rounded bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#111111] transition-colors">
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </div>
              </div>
            </Link>

            {/* Category 4: Unisex Heavy */}
            <Link
              to="/shop?fit=Unisex+Heavy"
              className="group relative block overflow-hidden rounded-xl bg-[#f5f3f0] shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e5e0d8]"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#efeeeb]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE3mwQgGI3hv55462YiSiORt8psNoIGYP6b2KiR5CwiW2M9DKx2eYt_CE3t_LQIw5rPVM9n3OTu8xFGurjoFbTFtTF_G-7vJZ1oOyj5uG7ftLAw0A9mVUP3zbapi6DW1_9YCmGTJZcY3V9oXKU4j8MJ8z2hfS6ojJL35XQeVWkckZtafneDpqxgpmcVaNduH2ZKM-EMSWQYzWwuWyM8UeIZsPUxp2VX9frOuwXgctzoWzs70YFGDg4"
                  alt="Unisex Heavy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#dce6cd]">Fit 04</span>
                  <h3 className="font-display font-bold text-lg text-white">Unisex Heavy</h3>
                  <p className="text-xs text-[#e4e2df]">Boxy drape for all.</p>
                </div>
                <div className="w-8 h-8 rounded bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#111111] transition-colors">
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED DROPS WITH FILTER TABS */}
      <section className="w-full py-12 md:py-16 bg-[#f5f3f0] border-t border-b border-[#e5e0d8]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#58614e]" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#5f615e]">
                  Live Stock • Instant Dispatch
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#111111] uppercase tracking-tight">
                Featured Drops
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#e5e0d8] shadow-sm">
              {[
                { label: 'All Drops', val: 'all' },
                { label: 'Oversized', val: 'oversized' },
                { label: 'Graphics', val: 'graphics' },
                { label: 'Acid Wash', val: 'acid-wash' },
              ].map((tab) => (
                <button
                  key={tab.val}
                  type="button"
                  onClick={() => setFilterCategory(tab.val)}
                  className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
                    filterCategory === tab.val
                      ? 'bg-[#111111] text-white shadow-sm'
                      : 'text-[#5f615e] hover:text-[#111111]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#111111] text-white px-8 py-4 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#262626] transition-all shadow-md"
            >
              <span>Explore All {products.length}+ T-Shirt Silhouettes</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE 360° FIT & FABRIC ANATOMY SHOWCASE */}
      <section className="w-full py-14 md:py-20 bg-[#fbf9f6]" id="fabric-spec">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12">
          <div className="bg-[#111111] text-white rounded-2xl overflow-hidden p-6 md:p-12 relative shadow-2xl border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column Spec Details */}
              <div className="lg:col-span-5 flex flex-col z-10">
                <div className="inline-flex items-center gap-1.5 text-[#dce6cd] bg-[#dce6cd]/15 px-3 py-1 rounded w-fit mb-4 border border-[#dce6cd]/20">
                  <span className="material-symbols-outlined text-[17px]">view_in_ar</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold">
                    Precision Fit Engineering
                  </span>
                </div>

                <h2 className="font-display text-3xl md:text-5xl leading-tight tracking-tight uppercase font-extrabold mb-4">
                  Fabric Depth &amp;<br />
                  360° Drape.
                </h2>

                <p className="text-sm text-[#c4c7c7] mb-6 leading-relaxed">
                  Standard commercial tees weigh 140–180 GSM and lose silhouette after two washes. TEE HUB garments are engineered with custom knitted 240 GSM organic French Terry—providing sculptural boxiness, natural cooling, and zero neckline sagging.
                </p>

                {/* Specification Badges */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10">
                    <span className="font-display text-xl font-extrabold text-white">240 GSM</span>
                    <p className="text-xs text-[#e4e2df] mt-0.5">Heavy organic French Terry</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10">
                    <span className="font-display text-xl font-extrabold text-white">100%</span>
                    <p className="text-xs text-[#e4e2df] mt-0.5">Long-staple combed cotton</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10">
                    <span className="font-display text-xl font-extrabold text-white">1.25"</span>
                    <p className="text-xs text-[#e4e2df] mt-0.5">Heavy-duty spandex-rib collar</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10">
                    <span className="font-display text-xl font-extrabold text-white">0% Fade</span>
                    <p className="text-xs text-[#e4e2df] mt-0.5">Bio-washed reactive dyes</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    to="/product/drift-more-oversized"
                    className="inline-flex items-center gap-2 bg-white text-[#111111] px-6 py-3 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#efeeeb] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">straighten</span>
                    <span>Inspect 360° Studio Model</span>
                  </Link>
                  <span className="text-[11px] text-[#c4c7c7] uppercase font-semibold">
                    Free Return On Fit Issues
                  </span>
                </div>
              </div>

              {/* Right Column Interactive Angle Viewer */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center relative mt-6 lg:mt-0">
                <div className="relative w-full max-w-lg aspect-[4/5] rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm flex items-center justify-center p-4 border border-white/15">
                  <img
                    src={fabricAngle.image}
                    alt={fabricAngle.label}
                    className="w-full h-full object-cover rounded-lg transition-all duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded flex items-center gap-1.5 text-white text-xs border border-white/15">
                    <span className="material-symbols-outlined text-[15px] text-[#dce6cd] animate-spin">
                      sync
                    </span>
                    <span className="text-[11px] uppercase font-bold tracking-wider">
                      Angle: {fabricAngle.label}
                    </span>
                  </div>

                  <div className="absolute bottom-4 inset-x-4 flex justify-center">
                    <div className="bg-black/85 backdrop-blur-md px-4 py-1.5 rounded flex items-center gap-2 shadow-xl border border-white/15 text-xs text-[#e4e2df]">
                      <span className="material-symbols-outlined text-[16px]">touch_app</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold">
                        Click angle tabs to inspect 360° structure
                      </span>
                    </div>
                  </div>
                </div>

                {/* Angle Switcher Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  {angleOptions.map((opt) => (
                    <button
                      key={opt.tabText}
                      type="button"
                      onClick={() => setFabricAngle({ label: opt.label, image: opt.image })}
                      className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        fabricAngle.label === opt.label
                          ? 'bg-white text-[#111111] shadow-lg'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                      }`}
                    >
                      {opt.tabText}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL BRAND STORY / WHY TEE HUB */}
      <section className="w-full py-14 md:py-20 bg-[#f5f3f0]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 flex flex-col pr-0 lg:pr-8">
              <span className="text-[11px] uppercase tracking-widest text-[#5f615e] mb-1 font-semibold">
                The Philosophy
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#111111] uppercase tracking-tight mb-4 leading-tight">
                Built For Your Everyday.<br />
                Engineered For The Long Run.
              </h2>
              <p className="text-sm text-[#5f615e] mb-3 leading-relaxed">
                At TEE HUB, we rejected fast-fashion flimsiness. Most t-shirts wrinkle into paper napkins after a few washes because they are made with cut-rate carded cotton and light yarn counts.
              </p>
              <p className="text-sm text-[#5f615e] mb-6 leading-relaxed">
                Our garments are knitted in Tirupur with zero-pilling long combed staple fibers. Each drop is tested against 50 high-temperature washes to guarantee that drop-shoulder arch holds its clean, architectural streetwear drape day in and day out.
              </p>

              <div className="flex flex-col gap-3 mb-8">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#58614e] text-[20px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <span className="font-bold text-xs text-[#111111]">Zero Chemical Harm:</span>
                    <span className="text-xs text-[#5f615e] ml-1">
                      OEKO-TEX certified reactive botanical dyes safe for prolonged humid wear.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#58614e] text-[20px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <span className="font-bold text-xs text-[#111111]">Drop Shoulder Precision:</span>
                    <span className="text-xs text-[#5f615e] ml-1">
                      Tailored armholes that fall naturally without creating bunching under the armpits.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#58614e] text-[20px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <span className="font-bold text-xs text-[#111111]">Reinforced Collar Rib:</span>
                    <span className="text-xs text-[#5f615e] ml-1">
                      Ribbed neckline lined with 5% LYCRA so it never turns wavy or loose over time.
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:text-[#58614e] transition-colors group"
                >
                  <span>Read Our Complete Milling Process</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden aspect-[3/4] bg-white border border-[#e5e0d8] shadow-sm">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFmr8VA_xuWSGc0esWScxiFTH3KXh-KVKp6sD7RgI_Ml6OCwVkh2qsqLUik_mjjKrDIzmRTAyc-pZRym4k7u419W4LgoMFUsKjHCP6aWzJX6YI4fYYEOzFNiaxwZ1XTRYr4S9cEoHbRbb86M3chpjnZuuccmHyB_QD8_5dbcBzmxiflobQZiqm_0ZbvFRBLshVaOtuhlr309eBR08m43_Q_-sv8SWkxtdx_CwOv1JC4JV-skn_lh1T"
                    alt="Model in streetwear drape"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#e5e0d8] shadow-sm flex flex-col justify-center">
                  <span className="font-display text-2xl font-extrabold text-[#111111]">50,000+</span>
                  <span className="text-xs text-[#5f615e]">Streetwear enthusiasts wearing TEE HUB across 28 Indian states</span>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="p-4 rounded-xl bg-[#111111] text-white flex flex-col justify-center">
                  <span className="font-display text-2xl font-extrabold text-[#dce6cd]">4.9 / 5</span>
                  <span className="text-xs text-[#e4e2df]">Over 8,400+ verified customer reviews</span>
                </div>
                <div className="rounded-xl overflow-hidden aspect-[3/4] bg-white border border-[#e5e0d8] shadow-sm">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuApQsonpqlYmm4tPtfu1FibWwt0ScStNOOmdDMpZeemJEgvwGAab0ld1N2th_hBUQbBIj6YUtXCr1cMVHwZe_H4tgxKthMGZ_dmZD5iPNCYGCAYHcci0EneQ-SdD4qlg1-QfY8WLlyo_v9XT8-vB6gmyrC9kEozSpaUgwkLkKklrvIUlLd7sUiGBcxxxJXeiFv3KJxvfsi7cIJRFAFC1n9kT2w2gtsROL0mdTfAOGo8WlClQul9PpPk"
                    alt="Hands inspecting French Terry fabric"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VERIFIED BUYER REVIEWS & STREET LOOKS */}
      <section className="w-full py-14 md:py-20 bg-[#fbf9f6]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#5f615e] font-semibold">
                Real Feedback • Real Fit
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#111111] uppercase tracking-tight">
                Real People. Real Style.
              </h2>
            </div>
            <div className="flex items-center gap-1.5 bg-[#efeeeb] px-3 py-1.5 rounded-lg border border-[#e5e0d8] text-xs">
              <span className="material-symbols-outlined text-[16px] text-[#b45309] fill-1">star</span>
              <span className="font-bold text-[#111111]">4.9 Overall Rating across 8,400+ orders</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="p-6 rounded-xl bg-[#f5f3f0] border border-[#e5e0d8] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-0.5 text-[#b45309] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px] fill-1">star</span>
                  ))}
                </div>
                <p className="text-xs md:text-sm text-[#111111] italic mb-4 leading-relaxed">
                  "The weight of this t-shirt is unlike anything else in India at ₹699. Usually brands advertise heavy cotton and send 180 GSM. This 240 GSM is thick, structured, and doesn't stick to the body in humid Mumbai weather."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-[#e5e0d8]">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-[#111111] text-xs shadow-sm border border-[#e5e0d8]">
                  AK
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-[#111111]">Aryan Kapoor</span>
                    <span className="material-symbols-outlined text-[#58614e] text-[15px]" title="Verified Buyer">verified</span>
                  </div>
                  <span className="text-[11px] text-[#5f615e]">Mumbai • Ordered: 'Better Days Ahead' (Size L)</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-6 rounded-xl bg-[#f5f3f0] border border-[#e5e0d8] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-0.5 text-[#b45309] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px] fill-1">star</span>
                  ))}
                </div>
                <p className="text-xs md:text-sm text-[#111111] italic mb-4 leading-relaxed">
                  "Washed it four times already in a standard machine wash cycle. Zero fading on the orange mountain graphic print, and the neck collar hasn't bacon-rippled at all. The drop shoulder sits cleanly on the deltoids."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-[#e5e0d8]">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-[#111111] text-xs shadow-sm border border-[#e5e0d8]">
                  RS
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-[#111111]">Rhea Sharma</span>
                    <span className="material-symbols-outlined text-[#58614e] text-[15px]" title="Verified Buyer">verified</span>
                  </div>
                  <span className="text-[11px] text-[#5f615e]">Bengaluru • Ordered: 'Explore More' (Size M)</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-6 rounded-xl bg-[#f5f3f0] border border-[#e5e0d8] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-0.5 text-[#b45309] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px] fill-1">star</span>
                  ))}
                </div>
                <p className="text-xs md:text-sm text-[#111111] italic mb-4 leading-relaxed">
                  "Customer service was exceptional. Swapped my XL for an L in 48 hours without any back and forth questioning. The packaging is 100% compostable and smelling fresh right out of the pouch. Big respect to the team."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-[#e5e0d8]">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-[#111111] text-xs shadow-sm border border-[#e5e0d8]">
                  DM
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-[#111111]">Devansh Mehta</span>
                    <span className="material-symbols-outlined text-[#58614e] text-[15px]" title="Verified Buyer">verified</span>
                  </div>
                  <span className="text-[11px] text-[#5f615e]">Delhi NCR • Ordered: 'Bloom Always' (Size L)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER / EXCLUSIVE EARLY ACCESS DROP */}
      <section className="w-full py-12 md:py-16 bg-[#f5f3f0] border-t border-[#e5e0d8]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12">
          <div className="relative bg-white rounded-2xl p-6 md:p-12 overflow-hidden shadow-sm border border-[#e5e0d8] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#58614e]">
                Secret Drop List
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#111111] uppercase tracking-tight mt-1 mb-2">
                Unlock ₹150 Off Your First T-Shirt Drop
              </h2>
              <p className="text-xs md:text-sm text-[#5f615e] leading-relaxed">
                Join 35,000+ members getting private batch access, archival drop restocks, and zero-spam streetwear updates right to your inbox.
              </p>
            </div>

            <div className="w-full md:w-auto min-w-[320px] max-w-md">
              {newsletterClaimed ? (
                <div className="p-4 bg-[#dce6cd] text-[#414a37] rounded-lg text-xs">
                  <p className="font-bold text-sm mb-1">🎉 Coupon Code Copied to Clipboard!</p>
                  <p className="font-mono font-bold text-base bg-white/70 px-3 py-1.5 rounded inline-block my-1 border border-[#414a37]/20">
                    FIRSTTEE150
                  </p>
                  <p className="text-[11px] mt-1 text-[#414a37]">
                    Apply this code at checkout to claim ₹150 off your order above ₹699.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                  <div className="flex items-center shadow-sm rounded-lg overflow-hidden border border-[#e5e0d8]">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-[#fbf9f6] px-4 py-3 text-xs text-[#111111] placeholder:text-[#858383] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-[#111111] text-white px-5 py-3 font-bold text-xs uppercase tracking-wider hover:bg-[#262626] transition-colors shrink-0 cursor-pointer"
                    >
                      Claim ₹150
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="material-symbols-outlined text-[#58614e] text-[15px]">lock</span>
                    <span className="text-[11px] text-[#5f615e]">No spam ever. Unsubscribe with 1 click anytime.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
