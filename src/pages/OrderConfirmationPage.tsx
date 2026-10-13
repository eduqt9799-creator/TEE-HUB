import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { Order } from '../types';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Shoot celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (id) {
      api.getOrderById(id).then(setOrder);
    }
  }, [id]);

  if (!order) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-32 text-center">
        <h2 className="font-display font-bold text-xl text-[#111111] mb-2">Generating Order Invoice...</h2>
        <Link to="/orders" className="text-xs font-bold text-[#111111] underline">
          View all your orders
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-[#fbf9f6] min-h-screen py-12">
      <div className="max-w-2xl mx-auto w-full px-4">
        {/* Success Header Box */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#e5e0d8] shadow-sm text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#dce6cd] text-[#414a37] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">check</span>
          </div>

          <span className="text-[10px] uppercase font-bold tracking-widest text-[#58614e] bg-[#f5f3f0] px-3 py-1 rounded">
            Confirmed &amp; Dispatched Queue
          </span>

          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#111111] uppercase tracking-tight mt-3 mb-2">
            Order #{order.id} Placed!
          </h1>

          <p className="text-xs text-[#5f615e] max-w-md mx-auto leading-relaxed">
            Thank you for shopping at TEE HUB. Your drop-shoulder garments have entered Tirupur packaging and inspection. We've sent your receipt to <strong>{order.shippingAddress.email}</strong>.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={`/orders/${order.id}`}
              className="bg-[#111111] text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#262626] transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              <span>Live Order Tracking</span>
            </Link>
            <Link
              to="/shop"
              className="bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#111111] px-5 py-3 rounded text-xs font-bold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Details Receipt Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#e5e0d8] shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#e5e0d8] text-xs">
            <div>
              <span className="text-[#858383] block text-[11px]">Estimated Delivery</span>
              <span className="font-bold text-[#111111]">{order.estimatedDeliveryDate}</span>
            </div>
            <div className="text-right">
              <span className="text-[#858383] block text-[11px]">Payment Mode</span>
              <span className="font-bold text-[#111111]">
                {order.paymentMethod} ({order.paymentStatus})
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-3">
              Garments in Package
            </h3>
            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img src={item.image} alt={item.productName} className="w-12 h-14 object-cover rounded bg-[#f5f3f0] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#111111] truncate">{item.productName}</p>
                    <p className="text-[11px] text-[#5f615e]">
                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-[#111111] tabular-nums">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="pt-4 border-t border-[#f5f3f0] text-xs">
            <h3 className="font-bold uppercase tracking-wider text-[#111111] mb-1.5">
              Doorstep Shipping Destination
            </h3>
            <p className="font-semibold text-[#111111]">{order.shippingAddress.fullName}</p>
            <p className="text-[#5f615e]">{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.landmark && (
              <p className="text-[#5f615e]">{order.shippingAddress.landmark}</p>
            )}
            <p className="text-[#5f615e]">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="text-[#5f615e] mt-1">Phone: {order.shippingAddress.phone}</p>
          </div>

          {/* Cost Totals */}
          <div className="pt-4 border-t border-[#e5e0d8] flex flex-col gap-1.5 text-xs text-[#5f615e]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#111111] font-semibold tabular-nums">₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#58614e]">
                <span>Discount</span>
                <span className="font-semibold tabular-nums">-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-[#111111] font-semibold tabular-nums">
                {order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#e5e0d8] text-sm font-bold text-[#111111]">
              <span>Total Paid</span>
              <span className="text-base tabular-nums">₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
