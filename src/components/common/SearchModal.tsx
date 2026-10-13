import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { api } from '../../services/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      api.getProducts().then(setProducts);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.fit.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.colors.some((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      )
    : products.slice(0, 4);

  const handleSelect = (slug: string) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleQuickCategory = (cat: string) => {
    onClose();
    navigate(`/shop?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-white max-w-xl w-full rounded-xl shadow-2xl border border-[#e5e0d8] overflow-hidden animate-fadeIn">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#e5e0d8] gap-3 bg-[#fbf9f6]">
          <span className="material-symbols-outlined text-[#5f615e] text-[22px]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search oversized, graphics, 240 GSM, plain..."
            className="w-full bg-transparent text-sm text-[#111111] placeholder:text-[#858383] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-[#858383] hover:text-[#111111]"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#858383] hover:text-[#111111] rounded"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick Filter Tags */}
        <div className="px-4 py-2.5 bg-[#f5f3f0] border-b border-[#e5e0d8] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[#5f615e] text-[11px] font-semibold uppercase tracking-wider shrink-0">
            Popular:
          </span>
          {['Oversized', 'Graphic Tees', 'Minimalist', 'Acid Wash', 'Plain'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleQuickCategory(cat)}
              className="px-2.5 py-1 bg-white hover:bg-[#111111] hover:text-white rounded text-[11px] font-medium transition-colors shrink-0 border border-[#e5e0d8]"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#5f615e] text-sm">
              <span className="material-symbols-outlined text-3xl mb-1 text-[#858383]">
                search_off
              </span>
              <p>No products found matching "{query}"</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/shop');
                }}
                className="mt-3 text-xs font-bold text-[#111111] underline"
              >
                Browse all drops in shop
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#858383]">
                {query ? 'Matching Silhouettes' : 'Featured Drops'}
              </div>
              {filtered.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelect(product.slug)}
                  className="flex items-center gap-3 p-2.5 hover:bg-[#f5f3f0] rounded-lg transition-colors cursor-pointer group"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-12 h-14 object-cover rounded bg-[#efeeeb] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111111] truncate group-hover:text-[#58614e]">
                        {product.name}
                      </span>
                      {product.tag && (
                        <span className="text-[10px] bg-[#efeeeb] text-[#58614e] font-semibold px-1.5 py-0.2 rounded shrink-0">
                          {product.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#5f615e] truncate mt-0.5">
                      {product.fit} • {product.gsm} GSM • {product.colors.length} Colors
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-[#111111]">₹{product.price}</span>
                    <span className="block text-[10px] text-[#858383] line-through">
                      ₹{product.originalPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom hint */}
        <div className="p-3 bg-[#fbf9f6] border-t border-[#e5e0d8] flex items-center justify-between text-[11px] text-[#858383]">
          <span>Press ESC or click outside to dismiss</span>
          <span>Tabular INR pricing</span>
        </div>
      </div>
    </div>
  );
};
