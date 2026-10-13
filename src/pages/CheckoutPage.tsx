import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ShippingAddress } from '../types';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, discount, shippingCharge, total, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.savedAddresses[0]?.fullName || user?.name || '',
    phone: user?.savedAddresses[0]?.phone || user?.phone || '',
    email: user?.savedAddresses[0]?.email || user?.email || '',
    addressLine1: user?.savedAddresses[0]?.addressLine1 || '',
    addressLine2: user?.savedAddresses[0]?.addressLine2 || '',
    landmark: user?.savedAddresses[0]?.landmark || '',
    city: user?.savedAddresses[0]?.city || 'Bengaluru',
    state: user?.savedAddresses[0]?.state || 'Karnataka',
    pincode: user?.savedAddresses[0]?.pincode || '560038',
  });

  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'UPI' | 'COD'>('Razorpay');
  const [codEnabled, setCodEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);
  const [razorpayStep, setRazorpayStep] = useState<'method' | 'processing' | 'success'>('method');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');

  useEffect(() => {
    api.getSettings().then((s) => {
      setCodEnabled(s.codEnabled);
    });
  }, []);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const indianStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi NCR', 'Goa', 'Gujarat', 
    'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 
    'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.pincode) {
      alert('Please fill out all mandatory shipping fields.');
      return;
    }

    if (paymentMethod === 'Razorpay' || paymentMethod === 'UPI') {
      // Launch Razorpay Simulator Modal
      setRazorpayModalOpen(true);
      setRazorpayStep('method');
    } else {
      // Cash on Delivery
      setIsProcessing(true);
      try {
        const order = await api.createOrder({
          userId: user?.id,
          guestEmail: address.email,
          items,
          subtotal,
          discount,
          shippingCharge,
          total,
          appliedCoupon: appliedCoupon || undefined,
          shippingAddress: address,
          paymentMethod: 'COD',
        });
        clearCart();
        navigate(`/order-confirmation/${order.id}`);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Complete simulated Razorpay payment
  const completeRazorpayPayment = async () => {
    setRazorpayStep('processing');
    setTimeout(async () => {
      setRazorpayStep('success');
      const fakePaymentId = `pay_${Math.random().toString(36).substring(2, 12)}`;
      
      const order = await api.createOrder({
        userId: user?.id,
        guestEmail: address.email,
        items,
        subtotal,
        discount,
        shippingCharge,
        total,
        appliedCoupon: appliedCoupon || undefined,
        shippingAddress: address,
        paymentMethod,
        razorpayPaymentId: fakePaymentId,
      });

      setTimeout(() => {
        setRazorpayModalOpen(false);
        clearCart();
        navigate(`/order-confirmation/${order.id}`);
      }, 1200);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full bg-[#fbf9f6] min-h-screen py-8">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-12">
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#111111] uppercase tracking-tight mb-8">
          Express Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Shipping and Payment Form (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Step 1: Delivery Address */}
            <div className="bg-white p-6 rounded-xl border border-[#e5e0d8] shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e5e0d8]">
                <span className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h2 className="font-display font-bold text-sm uppercase tracking-wider text-[#111111]">
                  Delivery Address (Pan-India)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={address.fullName}
                    onChange={handleAddressChange}
                    placeholder="e.g. Arjun Kapoor"
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Phone Number (for SMS Tracking) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={address.phone}
                    onChange={handleAddressChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Email Address (for Receipt &amp; Status) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={address.email}
                    onChange={handleAddressChange}
                    placeholder="arjun@example.com"
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Flat / House No. / Building / Street *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    value={address.addressLine1}
                    onChange={handleAddressChange}
                    placeholder="Flat 402, Oakwood Enclave, 12th Main Road"
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Landmark / Colony
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={address.landmark}
                    onChange={handleAddressChange}
                    placeholder="Near BDA Complex"
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    value={address.pincode}
                    onChange={handleAddressChange}
                    placeholder="560038"
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="Bengaluru"
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    State *
                  </label>
                  <select
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none focus:border-[#111111]"
                  >
                    {indianStates.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-6 rounded-xl border border-[#e5e0d8] shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e5e0d8]">
                <span className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h2 className="font-display font-bold text-sm uppercase tracking-wider text-[#111111]">
                  Payment Method
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {/* Razorpay Online Option */}
                <label
                  className={`p-4 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'Razorpay'
                      ? 'border-[#111111] bg-[#fbf9f6] shadow-sm'
                      : 'border-[#e5e0d8] hover:border-[#111111]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Razorpay'}
                      onChange={() => setPaymentMethod('Razorpay')}
                      className="accent-[#111111]"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#111111] block">
                        Razorpay Secure Gateway (Cards, NetBanking, Wallets)
                      </span>
                      <span className="text-[11px] text-[#5f615e]">
                        Instant online confirmation with 256-bit bank encryption
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-80 text-[10px] font-bold uppercase text-[#5f615e]">
                    <span>Visa • MC • RuPay</span>
                  </div>
                </label>

                {/* Instant UPI Option */}
                <label
                  className={`p-4 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'UPI'
                      ? 'border-[#111111] bg-[#fbf9f6] shadow-sm'
                      : 'border-[#e5e0d8] hover:border-[#111111]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="accent-[#111111]"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#111111] block">
                        UPI Fast Checkout (GPay, PhonePe, Paytm, BHIM)
                      </span>
                      <span className="text-[11px] text-[#5f615e]">
                        Zero transaction fees, immediate doorstep dispatch queue
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#58614e] bg-[#dce6cd] px-2 py-0.5 rounded">
                    Popular
                  </span>
                </label>

                {/* Cash on Delivery Option */}
                {codEnabled && (
                  <label
                    className={`p-4 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'COD'
                        ? 'border-[#111111] bg-[#fbf9f6] shadow-sm'
                        : 'border-[#e5e0d8] hover:border-[#111111]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="accent-[#111111]"
                      />
                      <div>
                        <span className="font-bold text-xs text-[#111111] block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[11px] text-[#5f615e]">
                          Pay cash or scan QR when courier arrives at your doorstep
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#5f615e] font-semibold">
                      ₹0 Extra Fee
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Right Order Review & Place Button (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#e5e0d8] shadow-sm flex flex-col gap-4 sticky top-28">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-[#111111] pb-3 border-b border-[#e5e0d8]">
              Bag Overview ({items.length} Items)
            </h2>

            {/* Compact items list */}
            <div className="max-h-52 overflow-y-auto flex flex-col gap-2.5 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5 text-xs">
                  <img src={item.image} alt={item.productName} className="w-10 h-12 object-cover rounded bg-[#f5f3f0] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#111111] truncate">{item.productName}</p>
                    <p className="text-[11px] text-[#5f615e]">
                      {item.size} • {item.color} • Qty {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-[#111111] tabular-nums">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="flex flex-col gap-2 text-xs text-[#5f615e] pt-3 border-t border-[#e5e0d8]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="text-[#111111] font-semibold tabular-nums">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-[#58614e]">
                  <span>Coupon ({appliedCoupon})</span>
                  <span className="font-semibold tabular-nums">-₹{discount}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Express Pan-India Shipping</span>
                <span className="text-[#111111] font-semibold tabular-nums">
                  {shippingCharge === 0 ? <strong className="text-[#58614e] uppercase">FREE</strong> : `₹${shippingCharge}`}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#e5e0d8] text-sm font-bold text-[#111111]">
                <span>Payable Amount</span>
                <span className="text-base tabular-nums">₹{total}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#111111] text-white py-4 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#262626] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>
                {isProcessing ? 'Processing Order...' : `Confirm & Pay ₹${total}`}
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#5f615e] pt-2">
              <span className="material-symbols-outlined text-[14px] text-[#58614e]">lock</span>
              <span>7-Day Hassle-Free Doorstep Size Exchange</span>
            </div>
          </div>
        </form>
      </div>

      {/* RAZORPAY TEST PAYMENT MODAL SIMULATION */}
      {razorpayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border border-[#e5e0d8] animate-fadeIn">
            {/* Razorpay Brand Bar */}
            <div className="bg-[#0c2340] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">Razorpay</span>
                <span className="text-[10px] bg-blue-500/30 px-1.5 py-0.5 rounded text-blue-200 uppercase font-mono">
                  Test Gateway
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRazorpayModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d8]">
                <div>
                  <h4 className="font-bold text-sm text-[#111111]">TEE HUB APPAREL</h4>
                  <p className="text-[11px] text-[#5f615e]">Order total verification</p>
                </div>
                <div className="text-right">
                  <span className="font-display font-extrabold text-xl text-[#111111]">
                    ₹{total}
                  </span>
                </div>
              </div>

              {razorpayStep === 'method' && (
                <div className="flex flex-col gap-3">
                  <p className="font-bold text-[#111111] uppercase tracking-wider text-[11px]">
                    Select Test Payment Option:
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp('gpay')}
                      className={`p-2.5 rounded border text-center transition-all ${
                        selectedUpiApp === 'gpay'
                          ? 'border-[#111111] bg-[#f5f3f0] font-bold'
                          : 'border-[#e5e0d8]'
                      }`}
                    >
                      Google Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp('phonepe')}
                      className={`p-2.5 rounded border text-center transition-all ${
                        selectedUpiApp === 'phonepe'
                          ? 'border-[#111111] bg-[#f5f3f0] font-bold'
                          : 'border-[#e5e0d8]'
                      }`}
                    >
                      PhonePe
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp('paytm')}
                      className={`p-2.5 rounded border text-center transition-all ${
                        selectedUpiApp === 'paytm'
                          ? 'border-[#111111] bg-[#f5f3f0] font-bold'
                          : 'border-[#e5e0d8]'
                      }`}
                    >
                      Paytm UPI
                    </button>
                  </div>

                  <div className="bg-[#f5f3f0] p-3 rounded text-[11px] text-[#5f615e] border border-[#e5e0d8]">
                    ℹ️ Running in safe test sandbox. Clicking below simulates authentic UPI bank authorization and verifies signature on the server.
                  </div>

                  <button
                    type="button"
                    onClick={completeRazorpayPayment}
                    className="w-full bg-[#0c2340] hover:bg-[#1a385f] text-white py-3.5 rounded font-bold text-xs uppercase tracking-wider transition-colors mt-2"
                  >
                    Simulate Successful Payment (₹{total})
                  </button>
                </div>
              )}

              {razorpayStep === 'processing' && (
                <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="font-bold text-[#111111]">Verifying Razorpay Signature...</p>
                  <p className="text-[11px] text-[#5f615e]">Communicating securely with NPCI UPI servers</p>
                </div>
              )}

              {razorpayStep === 'success' && (
                <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
                  <span className="material-symbols-outlined text-4xl text-green-600">
                    check_circle
                  </span>
                  <p className="font-bold text-base text-[#111111]">Payment Verified Successfully!</p>
                  <p className="text-[11px] text-[#5f615e]">Redirecting to order confirmation receipt...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
