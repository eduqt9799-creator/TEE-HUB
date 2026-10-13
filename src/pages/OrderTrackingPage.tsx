import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Order, OrderStatus } from '../types';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchId, setSearchId] = useState(id || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadOrder(id);
    }
  }, [id]);

  const loadOrder = async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getOrderById(orderId.trim());
      if (res) {
        setOrder(res);
      } else {
        setError(`No order found matching "${orderId}". Please check your order ID.`);
        setOrder(null);
      }
    } catch {
      setError('Failed to retrieve order tracking details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      loadOrder(searchId);
    }
  };

  const statusSteps: OrderStatus[] = [
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const getStepIndex = (status: OrderStatus): number => {
    return statusSteps.indexOf(status);
  };

  const currentStepIdx = order ? getStepIndex(order.status) : -1;

  return (
    <div className="flex flex-col w-full bg-[#fbf9f6] min-h-screen py-8">
      <div className="max-w-3xl mx-auto w-full px-4 md:px-8">
        <div className="mb-6">
          <span className="text-[11px] uppercase tracking-widest text-[#58614e] font-bold">
            Live Dispatch Pipeline
          </span>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#111111] uppercase tracking-tight mt-1">
            Order Status &amp; Tracking
          </h1>
          <p className="text-xs text-[#5f615e] mt-1">
            Track real-time shipment movements from Tirupur textile mills to your doorstep
          </p>
        </div>

        {/* Search Order Bar */}
        <form onSubmit={handleSearch} className="bg-white p-3 rounded-xl border border-[#e5e0d8] shadow-sm flex gap-2 mb-8">
          <div className="flex-1 flex items-center gap-2 px-2">
            <span className="material-symbols-outlined text-[#858383] text-[20px]">search</span>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.toUpperCase())}
              placeholder="Enter Order ID (e.g. TH-90214 or TH-84920)"
              className="w-full text-xs font-mono uppercase bg-transparent text-[#111111] placeholder:text-[#858383] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#111111] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#262626] transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-[#ffdad6] text-[#93000a] rounded-xl text-xs mb-8 flex items-center gap-2 border border-[#ba1a1a]/20">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {order && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Header Status Card */}
            <div className="bg-white p-6 rounded-xl border border-[#e5e0d8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#5f615e] tracking-wider">
                  Order Number:
                </span>
                <h2 className="font-display font-extrabold text-xl text-[#111111]">
                  #{order.id}
                </h2>
                <p className="text-xs text-[#5f615e] mt-0.5">
                  Carrier: <strong>{order.carrierName || 'Delhivery Express'}</strong> • Tracking: <span className="font-mono font-bold text-[#111111]">{order.trackingNumber}</span>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  order.status === 'Delivered'
                    ? 'bg-[#dce6cd] text-[#414a37]'
                    : order.status === 'Cancelled'
                    ? 'bg-[#ffdad6] text-[#93000a]'
                    : 'bg-[#111111] text-white'
                }`}>
                  {order.status}
                </span>
                <p className="text-xs text-[#5f615e] mt-1">
                  Est. Delivery: <strong>{order.estimatedDeliveryDate}</strong>
                </p>
              </div>
            </div>

            {/* Visual Step-by-Step Stepper */}
            <div className="bg-white p-6 rounded-xl border border-[#e5e0d8] shadow-sm">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#111111] mb-6">
                Shipment Progression
              </h3>

              <div className="relative flex items-center justify-between">
                {/* Connecting Line */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-[#eae8e5] z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#111111] z-0 transition-all duration-500"
                  style={{
                    width: `${Math.max(0, Math.min(100, (currentStepIdx / (statusSteps.length - 1)) * 100))}%`,
                  }}
                />

                {statusSteps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-[#111111] text-white shadow-md'
                            : 'bg-white border-2 border-[#e5e0d8] text-[#858383]'
                        } ${isCurrent ? 'ring-4 ring-[#111111]/20 scale-110' : ''}`}
                      >
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[10px] mt-2 text-center max-w-[65px] font-semibold ${
                        isCompleted ? 'text-[#111111]' : 'text-[#858383]'
                      }`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Activity Logs */}
            <div className="bg-white p-6 rounded-xl border border-[#e5e0d8] shadow-sm">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#111111] mb-4">
                Milestone Activity Log
              </h3>

              <div className="flex flex-col gap-4 relative pl-4 border-l-2 border-[#e5e0d8]">
                {order.timeline.map((event, i) => (
                  <div key={i} className="relative flex flex-col gap-0.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#111111] absolute -left-[21px] top-1" />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#111111]">{event.status}</span>
                      <span className="text-[11px] text-[#858383]">{event.timestamp}</span>
                    </div>
                    <p className="text-[#5f615e] leading-relaxed">{event.description}</p>
                    {event.location && (
                      <span className="text-[10px] text-[#58614e] font-semibold">
                        Location: {event.location}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Garments in package */}
            <div className="bg-white p-6 rounded-xl border border-[#e5e0d8] shadow-sm">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#111111] mb-3">
                Items in Consignment
              </h3>
              <div className="flex flex-col gap-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <img src={item.image} alt={item.productName} className="w-12 h-14 object-cover rounded bg-[#f5f3f0] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.slug}`} className="font-bold text-[#111111] hover:underline truncate block">
                        {item.productName}
                      </Link>
                      <span className="text-[11px] text-[#5f615e]">
                        Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-[#111111] tabular-nums">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
