import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Order, Product, ShippingAddress } from '../types';

export const AccountPage: React.FC = () => {
  const { user, updateProfile, addAddress, logout, setIsAuthModalOpen } = useAuth();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // New Address form
  const [newAddr, setNewAddr] = useState<ShippingAddress>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '',
  });

  useEffect(() => {
    api.getOrders().then(setOrders);
    api.getProducts().then((all) => {
      setWishlistProducts(all.filter((p) => wishlistIds.includes(p.id)));
    });
  }, [wishlistIds]);

  if (!user) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-28 text-center">
        <h2 className="font-display font-extrabold text-2xl text-[#111111] uppercase mb-2">
          Account Sign In
        </h2>
        <p className="text-xs text-[#5f615e] max-w-sm mx-auto mb-6">
          Sign in to access your saved delivery addresses, past orders, and drop access.
        </p>
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(true)}
          className="bg-[#111111] text-white px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#262626]"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.addressLine1 || !newAddr.pincode) return;
    addAddress(newAddr);
    setIsAddingAddress(false);
  };

  const handleMoveToBag = (product: Product) => {
    addItem(product, 'L', product.colors[0]?.name || 'Standard', product.colors[0]?.hex || '#000000', 1);
  };

  return (
    <div className="flex flex-col w-full bg-[#fbf9f6] min-h-screen py-8">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-12">
        {/* Profile Banner */}
        <div className="bg-white p-6 md:p-8 rounded-xl border border-[#e5e0d8] shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#111111] text-white flex items-center justify-center font-display font-extrabold text-lg">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-xl text-[#111111]">
                  {user.name}
                </h1>
                {user.role === 'admin' && (
                  <span className="bg-[#dce6cd] text-[#414a37] text-[10px] font-bold px-2 py-0.5 rounded">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5f615e]">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="bg-[#58614e] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#414a37] transition-colors"
              >
                ⚡ Admin Dashboard
              </Link>
            )}
            <button
              type="button"
              onClick={logout}
              className="bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#ba1a1a] px-4 py-2 rounded text-xs font-bold transition-colors border border-[#e5e0d8]"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#e5e0d8] pb-px mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'orders', label: 'Order History', icon: 'package_2' },
            { id: 'addresses', label: 'Saved Addresses', icon: 'home_pin' },
            { id: 'wishlist', label: `Wishlist (${wishlistIds.length})`, icon: 'favorite' },
            { id: 'profile', label: 'Account Details', icon: 'badge' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#111111] text-[#111111]'
                  : 'border-transparent text-[#5f615e] hover:text-[#111111]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-4">
            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-[#e5e0d8]">
                <p className="text-xs text-[#5f615e]">No past orders found.</p>
                <Link to="/shop" className="mt-3 inline-block font-bold text-xs text-[#111111] underline">
                  Explore new drops
                </Link>
              </div>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="bg-white p-6 rounded-xl border border-[#e5e0d8] shadow-sm flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#f5f3f0] gap-2 text-xs">
                    <div>
                      <span className="font-bold text-sm text-[#111111]">Order #{o.id}</span>
                      <span className="text-[#858383] ml-2 text-[11px]">{new Date(o.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        o.status === 'Delivered'
                          ? 'bg-[#dce6cd] text-[#414a37]'
                          : 'bg-[#111111] text-white'
                      }`}>
                        {o.status}
                      </span>
                      <Link
                        to={`/orders/${o.id}`}
                        className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-0.5"
                      >
                        <span>Live Tracking</span>
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {o.items.map((it) => (
                        <div key={it.id} className="flex items-center gap-2 text-xs">
                          <img src={it.image} alt={it.productName} className="w-12 h-14 object-cover rounded bg-[#f5f3f0]" />
                          <div>
                            <p className="font-bold text-[#111111] text-xs">{it.productName}</p>
                            <p className="text-[11px] text-[#5f615e]">Size {it.size} • Qty {it.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-[#5f615e] block">Total Amount</span>
                      <span className="font-bold text-sm text-[#111111] tabular-nums">₹{o.total}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-[#111111]">
                Your Delivery Addresses
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="bg-[#111111] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#262626]"
              >
                {isAddingAddress ? 'Cancel' : '+ Add Address'}
              </button>
            </div>

            {isAddingAddress && (
              <form onSubmit={handleSaveAddress} className="bg-white p-6 rounded-xl border border-[#e5e0d8] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 font-bold text-xs uppercase tracking-wider text-[#111111] border-b border-[#f5f3f0] pb-2">
                  New Delivery Destination
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newAddr.addressLine1}
                    onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
                  <button
                    type="submit"
                    className="bg-[#111111] text-white px-6 py-2.5 rounded font-bold text-xs uppercase"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.savedAddresses.map((addr, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-[#e5e0d8] shadow-sm text-xs flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-sm text-[#111111] block mb-1">{addr.fullName}</span>
                    <p className="text-[#5f615e]">{addr.addressLine1}</p>
                    <p className="text-[#5f615e]">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-[#5f615e] mt-2">Phone: {addr.phone}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#f5f3f0] flex items-center justify-between text-[11px] font-bold text-[#58614e]">
                    <span>✓ Verified Pin</span>
                    <span>Standard Address</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="flex flex-col gap-4">
            {wishlistProducts.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-[#e5e0d8]">
                <p className="text-xs text-[#5f615e]">Your wishlist is currently empty.</p>
                <Link to="/shop" className="mt-2 inline-block font-bold text-xs text-[#111111] underline">
                  Explore silhouettes in shop
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistProducts.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden p-3 flex flex-col justify-between">
                    <Link to={`/product/${p.slug}`} className="aspect-square w-full rounded overflow-hidden bg-[#f5f3f0] block mb-2">
                      <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" />
                    </Link>
                    <div>
                      <h4 className="font-bold text-xs text-[#111111] truncate">{p.name}</h4>
                      <p className="text-xs text-[#5f615e] font-semibold tabular-nums mt-0.5">₹{p.price}</p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleMoveToBag(p)}
                        className="flex-1 bg-[#111111] text-white py-1.5 rounded text-xs font-bold uppercase hover:bg-[#262626]"
                      >
                        Add to Bag
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(p.id)}
                        className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded transition-colors"
                        title="Remove from wishlist"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-xl border border-[#e5e0d8] max-w-xl">
            <h3 className="font-display font-bold text-base text-[#111111] mb-4">
              Profile Information
            </h3>
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <span className="text-[#858383] block text-[11px]">Full Name</span>
                <span className="font-bold text-sm text-[#111111]">{user.name}</span>
              </div>
              <div>
                <span className="text-[#858383] block text-[11px]">Email</span>
                <span className="font-bold text-sm text-[#111111]">{user.email}</span>
              </div>
              <div>
                <span className="text-[#858383] block text-[11px]">Phone</span>
                <span className="font-bold text-sm text-[#111111]">{user.phone || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-[#858383] block text-[11px]">Account Type</span>
                <span className="font-bold text-sm text-[#58614e] capitalize">{user.role}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
