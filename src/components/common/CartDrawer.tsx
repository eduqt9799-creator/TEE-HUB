import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    shippingCharge,
    total,
    appliedCoupon,
    couponMessage,
    applyCoupon,
    removeCoupon,
    amountNeededForFreeShipping,
    freeShippingThreshold,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput.trim());
    setIsApplying(false);
  };

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#e5e0d8] flex items-center justify-between bg-[#fbf9f6]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#111111] text-[22px]">
                shopping_bag
              </span>
              <h2 className="font-display text-lg font-bold text-[#111111] uppercase tracking-tight">
                Your Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 text-[#5f615e] hover:text-[#111111] rounded"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#f5f3f0] p-3 border-b border-[#e5e0d8]">
            {amountNeededForFreeShipping > 0 ? (
              <div className="flex flex-col gap-1.5 text-xs text-[#5f615e]">
                <div className="flex items-center justify-between">
                  <span>
                    Add <strong className="text-[#111111] font-bold">₹{amountNeededForFreeShipping}</strong> more for Free Shipping!
                  </span>
                  <span className="text-[11px] font-semibold">₹{freeShippingThreshold} Goal</span>
                </div>
                <div className="w-full bg-[#eae8e5] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#58614e] h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, ((freeShippingThreshold - amountNeededForFreeShipping) / freeShippingThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-[#414a37] font-semibold">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>You unlocked <strong>FREE Express Pan-India Shipping!</strong></span>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#5f615e]">
                <div className="w-16 h-16 rounded-full bg-[#f5f3f0] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-3xl text-[#858383]">
                    shopping_bag
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-[#111111] mb-1">
                  Your Bag Is Empty
                </h3>
                <p className="text-xs text-[#5f615e] mb-4 max-w-xs">
                  Inspect our 240 GSM heavy French Terry drops and find your perfect oversized fit.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/shop');
                  }}
                  className="bg-[#111111] text-white font-bold text-xs px-6 py-3 rounded hover:bg-[#262626] transition-colors"
                >
                  Explore Drops
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 pb-4 border-b border-[#f5f3f0] items-start group"
                >
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="w-20 h-24 bg-[#efeeeb] rounded overflow-hidden shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={() => setIsCartDrawerOpen(false)}
                        className="font-bold text-xs text-[#111111] hover:underline truncate"
                      >
                        {item.productName}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[#858383] hover:text-[#ba1a1a] p-0.5 transition-colors"
                        title="Remove item"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#5f615e]">
                      <span>Size: <strong>{item.size}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        {item.color}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-[#f5f3f0] rounded h-7 px-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#111111] hover:bg-[#eae8e5] rounded text-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#111111] hover:bg-[#eae8e5] rounded text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-xs text-[#111111] tabular-nums">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#fbf9f6] border-t border-[#e5e0d8] flex flex-col gap-3">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 bg-[#dce6cd] text-[#414a37] rounded text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">sell</span>
                    <span>Coupon <strong>{appliedCoupon}</strong> Applied (-₹{discount})</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-[#ba1a1a] hover:underline font-bold text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Coupon code (e.g. FIRSTTEE150)"
                    className="flex-1 bg-white border border-[#e5e0d8] px-3 py-1.5 rounded text-xs font-mono uppercase focus:outline-none focus:border-[#111111]"
                  />
                  <button
                    type="submit"
                    disabled={isApplying || !couponInput.trim()}
                    className="bg-[#111111] text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-[#262626] transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponMessage && !appliedCoupon && (
                <p className="text-[11px] text-[#ba1a1a]">{couponMessage}</p>
              )}

              {/* Subtotals */}
              <div className="flex flex-col gap-1.5 text-xs text-[#5f615e] pt-1">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#111111] font-semibold tabular-nums">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-[#58614e]">
                    <span>Discount</span>
                    <span className="font-semibold tabular-nums">-₹{discount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Shipping (Pan-India)</span>
                  <span className="text-[#111111] font-semibold tabular-nums">
                    {shippingCharge === 0 ? (
                      <span className="text-[#58614e] uppercase font-bold">FREE</span>
                    ) : (
                      `₹${shippingCharge}`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#e5e0d8] font-bold text-sm text-[#111111]">
                  <span>Total Amount</span>
                  <span className="text-base tabular-nums">₹{total}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 mt-1">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full bg-[#111111] text-white py-3.5 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#262626] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>Proceed to Checkout • ₹{total}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#111111] py-2.5 rounded font-semibold text-xs transition-colors"
                >
                  View Full Cart Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
