import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const {
    items,
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

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput.trim());
    setIsApplying(false);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-[#f5f3f0] flex items-center justify-center mx-auto mb-4 border border-[#e5e0d8]">
          <span className="material-symbols-outlined text-4xl text-[#858383]">
            shopping_bag
          </span>
        </div>
        <h1 className="font-display font-extrabold text-2xl text-[#111111] mb-2 uppercase">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs text-[#5f615e] max-w-sm mx-auto mb-6">
          Find your drop-shoulder drape and premium 240 GSM organic cotton essentials.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-[#111111] text-white px-8 py-3.5 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#262626] transition-colors"
        >
          Explore All Drops
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-[#fbf9f6] min-h-screen py-8">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-12">
        <h1 className="font-display font-extrabold text-3xl text-[#111111] uppercase tracking-tight mb-6">
          Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)} Items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Free shipping banner */}
            <div className="bg-[#f5f3f0] p-4 rounded-xl border border-[#e5e0d8] flex flex-col gap-2">
              {amountNeededForFreeShipping > 0 ? (
                <>
                  <div className="flex items-center justify-between text-xs text-[#5f615e]">
                    <span>
                      Add <strong>₹{amountNeededForFreeShipping}</strong> more to unlock <strong>FREE Express Pan-India Shipping!</strong>
                    </span>
                    <span className="font-bold">₹{freeShippingThreshold} Goal</span>
                  </div>
                  <div className="w-full bg-[#eae8e5] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#58614e] h-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, ((freeShippingThreshold - amountNeededForFreeShipping) / freeShippingThreshold) * 100)}%`,
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-xs text-[#414a37] font-semibold">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>You've unlocked <strong>FREE Express Pan-India Shipping!</strong></span>
                </div>
              )}
            </div>

            {/* Items Table / Cards */}
            <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden shadow-sm">
              <div className="p-4 bg-[#fbf9f6] border-b border-[#e5e0d8] hidden sm:grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider text-[#5f615e]">
                <div className="col-span-6">Garment Silhouette</div>
                <div className="col-span-2 text-center">Unit Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              <div className="divide-y divide-[#f5f3f0]">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                    {/* Item Info */}
                    <div className="col-span-6 flex items-center gap-4 w-full">
                      <Link
                        to={`/product/${item.slug}`}
                        className="w-20 h-24 bg-[#efeeeb] rounded overflow-hidden shrink-0 border border-[#e5e0d8]"
                      >
                        <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.slug}`}
                          className="font-bold text-xs text-[#111111] hover:underline"
                        >
                          {item.productName}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#5f615e]">
                          <span>Size: <strong>{item.size}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            {item.color}
                          </span>
                          <span>•</span>
                          <span>{item.gsm} GSM</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-[11px] text-[#ba1a1a] hover:underline mt-2 flex items-center gap-0.5"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-2 text-center text-xs text-[#111111] tabular-nums font-semibold hidden sm:block">
                      ₹{item.price}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="col-span-2 flex justify-center w-full sm:w-auto">
                      <div className="flex items-center bg-[#f5f3f0] rounded h-8 px-2 border border-[#e5e0d8]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-[#111111] hover:bg-[#eae8e5] rounded"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-xs tabular-nums text-[#111111]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-[#111111] hover:bg-[#eae8e5] rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-2 text-right w-full sm:w-auto flex justify-between sm:block">
                      <span className="sm:hidden text-xs text-[#5f615e]">Total:</span>
                      <span className="font-bold text-sm text-[#111111] tabular-nums">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#e5e0d8] shadow-sm flex flex-col gap-4">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-[#111111] pb-3 border-b border-[#e5e0d8]">
              Order Summary
            </h2>

            {/* Coupon Section */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-[#dce6cd] text-[#414a37] rounded text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">sell</span>
                  <span>Coupon <strong>{appliedCoupon}</strong> Applied (-₹{discount})</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-[#ba1a1a] hover:underline text-[11px] font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex flex-col gap-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon (FIRSTTEE150)"
                    className="flex-1 bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs font-mono uppercase focus:outline-none focus:border-[#111111]"
                  />
                  <button
                    type="submit"
                    disabled={isApplying || !couponInput.trim()}
                    className="bg-[#111111] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#262626] transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && <p className="text-[11px] text-[#ba1a1a]">{couponMessage}</p>}
              </form>
            )}

            {/* Cost Breakdown */}
            <div className="flex flex-col gap-2 text-xs text-[#5f615e] pt-2 border-t border-[#f5f3f0]">
              <div className="flex items-center justify-between">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="text-[#111111] font-semibold tabular-nums">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-[#58614e]">
                  <span>Coupon Discount</span>
                  <span className="font-semibold tabular-nums">-₹{discount}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Shipping (Express Pan-India)</span>
                <span className="text-[#111111] font-semibold tabular-nums">
                  {shippingCharge === 0 ? (
                    <span className="text-[#58614e] font-bold uppercase">FREE</span>
                  ) : (
                    `₹${shippingCharge}`
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#e5e0d8] text-sm font-bold text-[#111111]">
                <span>Total Payable</span>
                <span className="text-base tabular-nums">₹{total}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#111111] text-white py-4 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#262626] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>Proceed to Checkout • ₹{total}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#5f615e] pt-2">
              <span className="material-symbols-outlined text-[15px] text-[#58614e]">verified_user</span>
              <span>256-Bit Razorpay Encrypted &amp; COD Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
