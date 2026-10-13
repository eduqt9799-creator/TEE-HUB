import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product, ProductSize, Review } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Product360Viewer } from '../components/360Viewer/Product360Viewer';
import { ProductCard } from '../components/product/ProductCard';
import { SizeGuideModal } from '../components/common/SizeGuideModal';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem, setIsCartDrawerOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [crossSellProducts, setCrossSellProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<ProductSize>('L');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isWritingReview, setIsWritingReview] = useState<boolean>(false);

  // Review Form State
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhoto, setReviewPhoto] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;

    api.getProductBySlug(slug).then((prod) => {
      if (prod) {
        setProduct(prod);
        setSelectedSize(prod.details.modelWearingSize || 'L');
        setSelectedColorIndex(0);
        setQuantity(1);

        // Fetch reviews
        api.getReviews(prod.id).then(setReviews);

        // Fetch cross-sell products
        api.getProducts().then((all) => {
          setCrossSellProducts(all.filter((p) => p.id !== prod.id).slice(0, 4));
        });
      }
    });
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-32 text-center">
        <h2 className="font-display font-bold text-xl text-[#111111] mb-2">Finding Garment Silhouette...</h2>
        <p className="text-xs text-[#5f615e] mb-6">Loading 360-degree studio frames and inventory status.</p>
        <Link to="/shop" className="bg-[#111111] text-white px-6 py-3 rounded text-xs font-bold uppercase">
          Back to Shop
        </Link>
      </div>
    );
  }

  const currentColor = product.colors[selectedColorIndex] || product.colors[0];
  const isLiked = isInWishlist(product.id);

  // Check inventory for this size and color variant
  const currentVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color.toLowerCase() === currentColor.name.toLowerCase()
  );
  const stockAvailable = currentVariant ? currentVariant.stock : 15;
  const isOutOfStock = stockAvailable <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, selectedSize, currentColor.name, currentColor.hex, quantity);
  };

  const handleOneClickCheckout = () => {
    if (isOutOfStock) return;
    addItem(product, selectedSize, currentColor.name, currentColor.hex, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) return;

    await api.submitReview({
      productId: product.id,
      productName: product.name,
      authorName: reviewAuthor,
      city: reviewCity || 'India',
      sizeBought: selectedSize,
      colorBought: currentColor.name,
      rating: reviewRating,
      comment: reviewComment,
      photoUrl: reviewPhoto || undefined,
    });

    const updatedRevs = await api.getReviews(product.id);
    setReviews(updatedRevs);
    setIsWritingReview(false);
    setReviewSubmitted(true);
    setReviewComment('');
    setReviewPhoto('');
  };

  const handleHelpfulVote = async (revId: string) => {
    await api.voteHelpful(revId);
    const updated = await api.getReviews(product.id);
    setReviews(updated);
  };

  return (
    <div className="flex flex-col w-full bg-[#fbf9f6]">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-12 py-4">
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[#5f615e] text-xs mb-6 select-none">
          <Link to="/" className="hover:text-[#111111] transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link to="/shop" className="hover:text-[#111111] transition-colors">Shop</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#111111] transition-colors">
            {product.category}
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#111111] font-semibold">{product.name}</span>
        </nav>

        {/* Main PDP Showcase: 7:5 Split Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* LEFT COLUMN: 360° Studio Viewer & Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Product360Viewer
              frames={product.frame360Images}
              angleImages={product.angleImages}
              productName={product.name}
            />
          </div>

          {/* RIGHT COLUMN: Garment Details, Selection & Checkout Actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#e5e0d8]">
            {/* Fabric & Collection Badges */}
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#dce6cd] text-[#414a37] px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                {product.tag || `${product.fit.toUpperCase()} FIT • ${product.gsm} GSM`}
              </span>
              <span className="bg-[#f5f3f0] text-[#5f615e] px-2.5 py-1 rounded text-[10px] font-semibold uppercase">
                {stockAvailable < 5 ? `Only ${stockAvailable} left in stock` : 'Limited Batch'}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="font-display text-2xl md:text-3xl text-[#111111] tracking-tight font-extrabold mb-1">
              {product.name}
            </h1>

            {/* Rating Summary with Clickable Reviews Anchor */}
            <div className="flex items-center gap-2 mb-4 text-xs">
              <div className="flex items-center text-[#b45309]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[17px] fill-1">star</span>
                ))}
              </div>
              <span className="font-bold text-[#111111] tabular-nums">{product.rating}</span>
              <a href="#reviews-section" className="text-[#5f615e] hover:underline">
                ({product.reviewCount} verified reviews)
              </a>
              <span className="text-[#e5e0d8]">•</span>
              <span className="text-[#58614e] font-semibold uppercase text-[10px]">
                1.4k bought this month
              </span>
            </div>

            {/* Price Panel */}
            <div className="flex items-baseline gap-2 mb-4 bg-[#f5f3f0] p-3 rounded-lg border border-[#e5e0d8]">
              <span className="font-display text-2xl font-bold text-[#111111] tabular-nums">
                ₹{product.price}
              </span>
              <span className="text-[#858383] line-through text-xs tabular-nums">
                ₹{product.originalPrice}
              </span>
              <span className="bg-[#58614e] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                {product.discountPercent}% OFF
              </span>
              <span className="ml-auto text-[11px] text-[#5f615e]">
                Inclusive of all taxes
              </span>
            </div>

            {/* Editorial Description */}
            <p className="text-xs text-[#5f615e] leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Garment Specifications Grid */}
            <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
              <div className="flex items-center gap-2 p-2 bg-[#f5f3f0] rounded border border-[#e5e0d8]/60">
                <span className="material-symbols-outlined text-[#58614e] text-[18px]">checkroom</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#111111] uppercase leading-tight">100% Combed Cotton</span>
                  <span className="text-[10px] text-[#5f615e]">Heavy French Terry</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-[#f5f3f0] rounded border border-[#e5e0d8]/60">
                <span className="material-symbols-outlined text-[#58614e] text-[18px]">straighten</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#111111] uppercase leading-tight">Drop-Shoulder Cut</span>
                  <span className="text-[10px] text-[#5f615e]">True Oversized Drape</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-[#f5f3f0] rounded border border-[#e5e0d8]/60">
                <span className="material-symbols-outlined text-[#58614e] text-[18px]">water_drop</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#111111] uppercase leading-tight">Bio-Washed &amp; Pre-Shrunk</span>
                  <span className="text-[10px] text-[#5f615e]">Zero Shrinkage</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-[#f5f3f0] rounded border border-[#e5e0d8]/60">
                <span className="material-symbols-outlined text-[#58614e] text-[18px]">brush</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#111111] uppercase leading-tight">High-Density Screenprint</span>
                  <span className="text-[10px] text-[#5f615e]">Crack-Resistant Inks</span>
                </div>
              </div>
            </div>

            {/* Color Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-semibold text-[#111111]">
                  Color: <span className="font-normal text-[#5f615e]">{currentColor.name}</span>
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#5f615e]">
                  {product.colors.length} Colorways Available
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`relative w-8 h-8 rounded-full shadow-inner transition-transform cursor-pointer ${
                      selectedColorIndex === idx
                        ? 'ring-2 ring-[#111111] ring-offset-2 scale-110'
                        : 'hover:scale-105 border border-black/15'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector + Size Guide Modal Trigger */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-semibold text-[#111111]">Select Size (IN):</span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-[#111111] hover:text-[#58614e] font-bold uppercase text-[11px] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">straighten</span>
                  <span>Size Guide &amp; 360° Fit Finder</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 rounded font-bold text-xs transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#111111] text-white shadow-md'
                        : 'bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#111111] border border-[#e5e0d8]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-[#5f615e] mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#58614e]">info</span>
                <span>
                  Model is {product.details.modelHeight} wearing size <strong className="text-[#111111]">{product.details.modelWearingSize}</strong> for a relaxed drop.
                </span>
              </p>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="flex items-center gap-2 mb-3">
              {/* Stepper */}
              <div className="flex items-center bg-[#f5f3f0] rounded h-[50px] px-2 border border-[#e5e0d8]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#111111] hover:bg-[#eae8e5] rounded font-bold text-sm"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-sm tabular-nums text-[#111111]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#111111] hover:bg-[#eae8e5] rounded font-bold text-sm"
                >
                  +
                </button>
              </div>

              {/* Add To Cart Primary */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 h-[50px] bg-[#111111] text-white rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#262626] transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>
                  {isOutOfStock ? 'Out of Stock' : `Add to Cart • ₹${product.price * quantity}`}
                </span>
              </button>

              {/* Wishlist Heart */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`w-[50px] h-[50px] bg-[#f5f3f0] hover:bg-[#eae8e5] border border-[#e5e0d8] rounded flex items-center justify-center transition-colors cursor-pointer ${
                  isLiked ? 'text-[#ba1a1a]' : 'text-[#111111]'
                }`}
                title="Save to Wishlist"
              >
                <span className={`material-symbols-outlined text-[20px] ${isLiked ? 'fill-1' : ''}`}>
                  favorite
                </span>
              </button>
            </div>

            {/* 1-Click Fast Checkout */}
            <button
              type="button"
              onClick={handleOneClickCheckout}
              disabled={isOutOfStock}
              className="w-full h-11 bg-[#efeeeb] hover:bg-[#e4e2df] text-[#111111] text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-colors mb-5 border border-[#e5e0d8] disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>1-Click Razorpay Instant Checkout</span>
            </button>

            {/* Service & Assurance Badges */}
            <div className="bg-[#f5f3f0] p-3 rounded-lg flex flex-col gap-2 border border-[#e5e0d8] text-xs text-[#111111]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#58614e] text-[18px]">local_shipping</span>
                <span><strong>Free Express Shipping</strong> across India on prepaid drops.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#58614e] text-[18px]">published_with_changes</span>
                <span><strong>7-Day Hassle-Free Exchange</strong> for size or color adjustment.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#58614e] text-[18px]">verified_user</span>
                <span><strong>Razorpay Certified</strong> 256-Bit SSL Payments &amp; Cash on Delivery.</span>
              </div>
            </div>
          </div>
        </div>

        {/* What Our Buyers Say Section */}
        <section id="reviews-section" className="mb-16 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#e5e0d8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-3 border-b border-[#e5e0d8]">
            <div>
              <h2 className="font-display font-extrabold text-xl text-[#111111] tracking-tight">
                What Our Buyers Say
              </h2>
              <p className="text-xs text-[#5f615e]">
                Real customer fit photos and tactile quality reports from over {product.reviewCount} verified drops
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsWritingReview(!isWritingReview)}
                className="bg-[#111111] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#262626] transition-colors"
              >
                {isWritingReview ? 'Close Review Form' : 'Write a Review'}
              </button>
            </div>
          </div>

          {/* Write a Review Modal/Drawer */}
          {isWritingReview && (
            <div className="p-4 md:p-6 bg-[#f5f3f0] rounded-xl my-6 border border-[#e5e0d8] animate-fadeIn">
              <h3 className="font-display font-bold text-sm text-[#111111] mb-2">Submit Verified Garment Review</h3>
              <p className="text-xs text-[#5f615e] mb-4">
                Share your fit feedback and outfit styling photo with the TEE HUB streetwear community.
              </p>

              <form onSubmit={handleReviewSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="e.g. Aryan Kapoor"
                    className="w-full bg-white border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">City / State</label>
                  <input
                    type="text"
                    value={reviewCity}
                    onChange={(e) => setReviewCity(e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full bg-white border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Star Rating</label>
                  <div className="flex items-center gap-1 text-[#b45309]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="material-symbols-outlined text-[24px] cursor-pointer"
                        style={{ fontVariationSettings: reviewRating >= star ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#111111] ml-2">{reviewRating} Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Outfit Photo URL (Optional)</label>
                  <input
                    type="url"
                    value={reviewPhoto}
                    onChange={(e) => setReviewPhoto(e.target.value)}
                    placeholder="https://.../outfit_look.jpg"
                    className="w-full bg-white border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Fit &amp; Tactile Review</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe fabric thickness, drop-shoulder geometry, wash resistance, and sizing..."
                    className="w-full bg-white border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWritingReview(false)}
                    className="px-4 py-2 bg-white text-[#5f615e] rounded text-xs font-semibold border border-[#e5e0d8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#111111] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#262626]"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            </div>
          )}

          {reviewSubmitted && (
            <div className="p-3 my-4 bg-[#dce6cd] text-[#414a37] rounded text-xs font-medium">
              ✓ Thank you! Your review has been recorded.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
            {/* Score & Bar Breakdown (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col bg-[#f5f3f0] p-6 rounded-xl border border-[#e5e0d8]">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-display text-4xl font-extrabold text-[#111111] leading-none tabular-nums">
                  {product.rating}
                </span>
                <span className="font-medium text-[#5f615e] text-sm">/ 5.0</span>
              </div>
              <div className="flex items-center text-[#b45309] mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[19px] fill-1">star</span>
                ))}
                <span className="text-xs text-[#111111] ml-2 font-semibold">97% would recommend</span>
              </div>

              {/* Progress Bars */}
              <div className="flex flex-col gap-2 text-xs">
                {[
                  { star: '5★', pct: 82 },
                  { star: '4★', pct: 12 },
                  { star: '3★', pct: 4 },
                  { star: '2★', pct: 1 },
                  { star: '1★', pct: 1 },
                ].map((row) => (
                  <div key={row.star} className="flex items-center gap-2">
                    <span className="w-5 text-[#111111] font-semibold text-right">{row.star}</span>
                    <div className="flex-1 h-2 bg-[#e5e0d8] rounded-full overflow-hidden">
                      <div className="h-full bg-[#111111] rounded-full" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span className="w-7 text-[#5f615e] text-right tabular-nums">{row.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Buyer Cards (8 Cols) */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#f5f3f0] p-5 rounded-xl border border-[#e5e0d8] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-white border border-[#e5e0d8] flex items-center justify-center font-bold text-[#111111] text-xs">
                          {rev.authorInitials}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#111111]">{rev.authorName}</h4>
                          <span className="flex items-center gap-1 text-[10px] text-[#58614e] uppercase font-semibold">
                            <span className="material-symbols-outlined text-[13px]">verified</span>
                            Verified Buyer • {rev.city}
                          </span>
                        </div>
                      </div>
                      <div className="flex text-[#b45309]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[15px] fill-1">star</span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#111111] mb-3 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#e5e0d8] text-xs">
                    <div className="flex items-center gap-2">
                      {rev.photoUrl && (
                        <div className="w-12 h-12 rounded overflow-hidden bg-white shadow-sm border border-[#e5e0d8]">
                          <img src={rev.photoUrl} alt="Outfit review look" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="text-[10px] text-[#5f615e]">
                        Size {rev.sizeBought} • {rev.usageDuration || 'Verified Drop'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleHelpfulVote(rev.id)}
                      className="flex items-center gap-1 text-[#5f615e] hover:text-[#111111] text-[11px] font-semibold transition-colors"
                      title="Mark as helpful"
                    >
                      <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                      <span className="tabular-nums">{rev.helpfulCount}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* You May Also Like Cross-Sell Products */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-extrabold text-xl text-[#111111] tracking-tight">
                You May Also Like
              </h2>
              <p className="text-xs text-[#5f615e]">Handcrafted capsules from the same heavyweight drop</p>
            </div>
            <Link to="/shop" className="flex items-center gap-1 text-xs uppercase font-bold text-[#111111] hover:text-[#58614e]">
              <span>View All Drops</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {crossSellProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        selectedSize={selectedSize}
        onSelectSize={(sz) => setSelectedSize(sz)}
      />
    </div>
  );
};
