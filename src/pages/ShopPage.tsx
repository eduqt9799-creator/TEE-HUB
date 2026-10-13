import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, ProductSize } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // URL Query synced filters
  const categoryParam = searchParams.get('category') || 'All';
  const tagParam = searchParams.get('tag') || '';
  const searchParam = searchParams.get('q') || '';
  const fitParam = searchParams.get('fit') || 'All';
  const sortParam = searchParams.get('sort') || 'featured';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedFit, setSelectedFit] = useState<string>(fitParam);
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1400);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>(sortParam);

  useEffect(() => {
    api.getProducts().then(setProducts);
  }, []);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (fitParam) setSelectedFit(fitParam);
  }, [categoryParam, fitParam]);

  const categories = [
    'All',
    'Oversized',
    'Graphic Tees',
    'Minimalist',
    'Plain',
    'Vintage Graphic',
    'Acid Wash',
  ];

  const fits = ['All', 'Oversized', 'Boxy', 'Drop Shoulder'];
  const sizes: ProductSize[] = ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['All', 'Off-White', 'Black', 'Olive', 'Sand'];

  // Toggle size filter
  const toggleSize = (size: ProductSize) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedFit('All');
    setSelectedSizes([]);
    setSelectedColor('All');
    setMaxPrice(1400);
    setInStockOnly(false);
    setSearchParams({});
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    // Category
    if (selectedCategory !== 'All' && p.category !== selectedCategory) {
      return false;
    }

    // Fit
    if (selectedFit !== 'All' && p.fit !== selectedFit) {
      return false;
    }

    // Search query
    if (searchParam && !p.name.toLowerCase().includes(searchParam.toLowerCase()) && !p.description.toLowerCase().includes(searchParam.toLowerCase())) {
      return false;
    }

    // Tag param
    if (tagParam === 'new' && !p.isNewArrival && !p.isBestseller) {
      return false;
    }

    // Sizes
    if (selectedSizes.length > 0 && !selectedSizes.some((s) => p.sizes.includes(s))) {
      return false;
    }

    // Color
    if (selectedColor !== 'All' && !p.colors.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()))) {
      return false;
    }

    // Price
    if (p.price > maxPrice) {
      return false;
    }

    // In Stock
    if (inStockOnly && p.variants.every((v) => v.stock === 0)) {
      return false;
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.reviewCount - a.reviewCount; // featured / popularity
  });

  return (
    <div className="flex flex-col w-full bg-[#fbf9f6] min-h-screen">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-12 py-8">
        {/* Header Title & Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#e5e0d8] gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#58614e] font-bold">
              Complete Silhouette Archive
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#111111] uppercase tracking-tight mt-1">
              Shop Heavyweight T-Shirts
            </h1>
            <p className="text-xs text-[#5f615e] mt-1">
              Showing {sortedProducts.length} curated styles crafted in 240–280 GSM French Terry
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white rounded border border-[#e5e0d8] text-xs font-bold text-[#111111]"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-[#e5e0d8] text-xs">
              <span className="text-[#858383] text-[11px] uppercase font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#111111] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured &amp; Popular</option>
                <option value="newest">Newest Drops</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated (4.8+)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid with Sidebar Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* DESKTOP SIDEBAR FILTERS (3 cols) */}
          <aside className={`lg:col-span-3 flex flex-col gap-6 bg-white p-6 rounded-xl border border-[#e5e0d8] shadow-sm ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d8]">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-[#111111]">
                Filter Silhouettes
              </span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] text-[#ba1a1a] font-bold hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="font-bold text-xs uppercase text-[#111111] mb-2.5">Category</h4>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left text-xs py-1 px-2 rounded transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-[#111111] text-white font-bold'
                        : 'text-[#5f615e] hover:bg-[#f5f3f0] hover:text-[#111111]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-70">
                      {cat === 'All'
                        ? products.length
                        : products.filter((p) => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fit Filter */}
            <div>
              <h4 className="font-bold text-xs uppercase text-[#111111] mb-2.5">Fit Profile</h4>
              <div className="flex flex-wrap gap-1.5">
                {fits.map((fit) => (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => setSelectedFit(fit)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      selectedFit === fit
                        ? 'bg-[#111111] text-white font-bold'
                        : 'bg-[#f5f3f0] text-[#5f615e] hover:bg-[#eae8e5]'
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h4 className="font-bold text-xs uppercase text-[#111111] mb-2.5">Size</h4>
              <div className="grid grid-cols-5 gap-1.5">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`py-2 rounded text-xs font-bold transition-colors ${
                      selectedSizes.includes(sz)
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#f5f3f0] text-[#111111] hover:bg-[#eae8e5] border border-[#e5e0d8]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <h4 className="font-bold text-xs uppercase text-[#111111] mb-2.5">Color Tone</h4>
              <div className="flex flex-wrap gap-1.5">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      selectedColor === c
                        ? 'bg-[#111111] text-white font-bold'
                        : 'bg-[#f5f3f0] text-[#5f615e] hover:bg-[#eae8e5]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <h4 className="font-bold uppercase text-[#111111]">Max Price</h4>
                <span className="font-bold text-[#111111] tabular-nums">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="699"
                max="1299"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#111111]"
              />
              <div className="flex justify-between text-[10px] text-[#858383] mt-1">
                <span>₹699</span>
                <span>₹1,299</span>
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-2 border-t border-[#e5e0d8]">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#111111]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#111111] rounded"
                />
                <span className="font-medium">In-Stock Silhouettes Only</span>
              </label>
            </div>
          </aside>

          {/* MAIN PRODUCT CATALOG (9 cols) */}
          <main className="lg:col-span-9 flex flex-col">
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#e5e0d8] p-12 text-center flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-[#858383] mb-2">
                  filter_alt_off
                </span>
                <h3 className="font-display font-bold text-base text-[#111111] mb-1">
                  No matching silhouettes found
                </h3>
                <p className="text-xs text-[#5f615e] max-w-sm mb-4">
                  Try clearing your filters or choosing another category to explore our drops.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="bg-[#111111] text-white px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
