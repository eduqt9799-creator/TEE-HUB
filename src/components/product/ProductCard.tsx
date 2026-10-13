import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, ProductSize } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isLiked = isInWishlist(product.id);
  const activeColor = product.colors[selectedColorIndex] || product.colors[0];

  const handleQuickAdd = (e: React.MouseEvent, size: ProductSize) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, size, activeColor.name, activeColor.hex, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden border border-[#e5e0d8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <Link to={`/product/${product.slug}`} className="relative aspect-square w-full bg-[#efeeeb] overflow-hidden block">
        {/* Top Badges */}
        {product.tag && (
          <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider bg-[#111111] text-white px-2 py-1 rounded">
            {product.tag}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-lg bg-white/85 backdrop-blur-md flex items-center justify-center transition-colors shadow-sm ${
            isLiked ? 'text-[#ba1a1a]' : 'text-[#5f615e] hover:text-[#ba1a1a]'
          }`}
        >
          <span className={`material-symbols-outlined text-[19px] ${isLiked ? 'fill-1' : ''}`}>
            favorite
          </span>
        </button>

        {/* Garment Image */}
        <img
          src={isHovered && product.secondaryImage ? product.secondaryImage : product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick Add Bar on Hover */}
        <div className="absolute bottom-3 inset-x-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 border border-[#e5e0d8]">
            <span className="text-[10px] text-[#111111] font-bold uppercase tracking-wider">
              Quick Add:
            </span>
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => handleQuickAdd(e, size)}
                className="px-2 py-0.5 text-[11px] font-bold rounded hover:bg-[#111111] hover:text-white text-[#111111] bg-[#f5f3f0] transition-colors cursor-pointer"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase tracking-wider text-[#58614e] font-bold">
              {product.fit} Drop
            </span>
            <div className="flex items-center gap-0.5 text-[#b45309]">
              <span className="material-symbols-outlined text-[14px] fill-1">star</span>
              <span className="text-xs font-semibold tabular-nums">{product.rating}</span>
              <span className="text-[#858383] text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="font-display font-bold text-sm text-[#111111] leading-snug hover:underline truncate">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-[#5f615e] mt-0.5 truncate">
            {product.tagline}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#f5f3f0] flex items-center justify-between">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-base text-[#111111] tabular-nums">
              ₹{product.price}
            </span>
            <span className="text-xs text-[#858383] line-through tabular-nums">
              ₹{product.originalPrice}
            </span>
            <span className="text-[10px] font-bold text-[#58614e]">
              {product.discountPercent}% OFF
            </span>
          </div>

          {/* Color Swatches */}
          <div className="flex items-center gap-1.5">
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColorIndex(idx)}
                className={`w-3.5 h-3.5 rounded-full transition-transform ${
                  selectedColorIndex === idx
                    ? 'ring-2 ring-[#111111] ring-offset-1 scale-110'
                    : 'hover:scale-105 border border-black/15'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
