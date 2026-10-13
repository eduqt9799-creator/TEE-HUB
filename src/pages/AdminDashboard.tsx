import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Product, Order, Review, BusinessSettings, OrderStatus, ProductSize } from '../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'reviews' | 'settings'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  // Search & Filtering
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Editing Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    category: 'Oversized',
    fit: 'Oversized',
    gsm: 240,
    fabric: '100% Combed Cotton',
    price: 799,
    originalPrice: 1299,
    discountPercent: 38,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtT1n7LBSCxKab6XbwJ3Iq4ASwJD1qfeZzzHGEv0xFg6RVoui74Pwm1VC-yO976FlMCJtwYY-j9bTycXh4J6yGxAlYSaErjO0x9siC4YbATmLxs8qE7lZ7k9SumASJO7tqCca-eDRXiJC2LuyxkpaNf2UYpAAR9GjjHvhxZdPpsN1v68zCDxRDSwA7uR8vWK566BR1v4c66jo0LdJ_HH4_OABHxW5julaGdfAl1cv040iJ1R2kaGUh',
    tag: '240 GSM',
    isFeatured: true,
  });

  // Settings Save State
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const [p, o, r, s] = await Promise.all([
      api.getProducts(),
      api.getOrders(),
      api.getAllReviewsForAdmin(),
      api.getSettings(),
    ]);
    setProducts(p);
    setOrders(o);
    setReviews(r);
    setSettings(s);
  };

  // KPIs
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Processing').length;
  const totalStockCount = products.reduce((acc, p) => acc + p.variants.reduce((s, v) => s + v.stock, 0), 0);
  const lowStockCount = products.filter((p) => p.variants.some((v) => v.stock < 10)).length;

  // Order status transition handler
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    await api.updateOrderStatus(orderId, newStatus);
    const updatedOrders = await api.getOrders();
    setOrders(updatedOrders);
  };

  // Review moderation handler
  const handleReviewModeration = async (reviewId: string, status: 'approved' | 'rejected') => {
    await api.updateReviewStatus(reviewId, status);
    const updatedReviews = await api.getAllReviewsForAdmin();
    setReviews(updatedReviews);
  };

  // Product Save / Create
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (editingProduct) {
      await api.updateProduct(editingProduct.id, productForm);
    } else {
      const slug = productForm.slug || productForm.name.toLowerCase().replace(/\s+/g, '-');
      await api.createProduct({
        ...productForm as any,
        slug,
        colors: [
          { name: 'Off-White', hex: '#FBF9F6' },
          { name: 'Jet Black', hex: '#1B1C1A' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        variants: [
          { id: `v-s`, size: 'S', color: 'Off-White', colorHex: '#FBF9F6', stock: 20, sku: `TH-${slug}-S` },
          { id: `v-m`, size: 'M', color: 'Off-White', colorHex: '#FBF9F6', stock: 20, sku: `TH-${slug}-M` },
          { id: `v-l`, size: 'L', color: 'Off-White', colorHex: '#FBF9F6', stock: 20, sku: `TH-${slug}-L` },
          { id: `v-xl`, size: 'XL', color: 'Off-White', colorHex: '#FBF9F6', stock: 20, sku: `TH-${slug}-XL` },
        ],
        angleImages: [],
        frame360Images: [],
        rating: 4.9,
        reviewCount: 0,
        details: {
          collar: '1.25" Spandex ribbing',
          washCare: 'Cold wash. Dry in shade.',
          shrinkage: 'Pre-shrunk',
          printType: 'Screenprint',
          modelHeight: `6'1"`,
          modelWearingSize: 'L',
        },
      });
    }

    setEditingProduct(null);
    setIsCreatingProduct(false);
    const updatedProds = await api.getProducts();
    setProducts(updatedProds);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await api.deleteProduct(id);
      const updatedProds = await api.getProducts();
      setProducts(updatedProds);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await api.updateSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="flex flex-col w-full bg-[#fbf9f6] min-h-screen py-8">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-12">
        {/* Top Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#e5e0d8] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#58614e] animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#58614e]">
                Store Control Portal
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#111111] uppercase tracking-tight mt-1">
              TEE HUB Admin Center
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#dce6cd] text-[#414a37] px-3 py-1.5 rounded font-bold uppercase">
              Operational Status: Live &amp; Synced
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-[#e5e0d8] pb-px mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'KPI Overview', icon: 'monitoring' },
            { id: 'products', label: `Products (${products.length})`, icon: 'apparel' },
            { id: 'orders', label: `Orders (${orders.length})`, icon: 'receipt_long' },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: 'rate_review' },
            { id: 'settings', label: 'Store Settings', icon: 'settings' },
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

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-xl border border-[#e5e0d8] shadow-sm">
                <span className="text-[11px] font-semibold text-[#5f615e] uppercase block mb-1">
                  Total Revenue
                </span>
                <span className="font-display font-extrabold text-2xl text-[#111111] tabular-nums">
                  ₹{totalRevenue.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#58614e] font-bold block mt-1">
                  From verified paid orders
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#e5e0d8] shadow-sm">
                <span className="text-[11px] font-semibold text-[#5f615e] uppercase block mb-1">
                  Total Orders
                </span>
                <span className="font-display font-extrabold text-2xl text-[#111111] tabular-nums">
                  {totalOrdersCount}
                </span>
                <span className="text-[10px] text-[#5f615e] block mt-1">
                  Pan-India dispatches
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#e5e0d8] shadow-sm">
                <span className="text-[11px] font-semibold text-[#5f615e] uppercase block mb-1">
                  Pending Orders
                </span>
                <span className="font-display font-extrabold text-2xl text-[#b45309] tabular-nums">
                  {pendingOrdersCount}
                </span>
                <span className="text-[10px] text-[#5f615e] block mt-1">
                  Queued in packaging
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#e5e0d8] shadow-sm">
                <span className="text-[11px] font-semibold text-[#5f615e] uppercase block mb-1">
                  Garments in Stock
                </span>
                <span className="font-display font-extrabold text-2xl text-[#111111] tabular-nums">
                  {totalStockCount}
                </span>
                <span className="text-[10px] text-[#58614e] font-bold block mt-1">
                  Across all variants
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#e5e0d8] shadow-sm">
                <span className="text-[11px] font-semibold text-[#5f615e] uppercase block mb-1">
                  Low-Stock Alerts
                </span>
                <span className={`font-display font-extrabold text-2xl tabular-nums ${
                  lowStockCount > 0 ? 'text-[#ba1a1a]' : 'text-[#58614e]'
                }`}>
                  {lowStockCount}
                </span>
                <span className="text-[10px] text-[#5f615e] block mt-1">
                  {lowStockCount > 0 ? 'Requires mill restock' : 'Healthy inventory'}
                </span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white p-6 rounded-xl border border-[#e5e0d8] shadow-sm">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-[#111111] mb-4">
                Recent Orders Stream
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f5f3f0] font-bold uppercase tracking-wider text-[#111111] text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Order #</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Mode</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Quick Transition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f5f3f0] text-[#111111]">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-[#fbf9f6]">
                        <td className="py-3 px-3 font-bold font-mono">#{o.id}</td>
                        <td className="py-3 px-3">
                          <span className="font-semibold">{o.shippingAddress.fullName}</span>
                          <span className="text-[#5f615e] block text-[10px]">{o.shippingAddress.city}</span>
                        </td>
                        <td className="py-3 px-3 font-bold tabular-nums">₹{o.total}</td>
                        <td className="py-3 px-3 text-[#5f615e]">{o.paymentMethod}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#111111] text-white">
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                            className="bg-[#f5f3f0] border border-[#e5e0d8] rounded text-xs px-2 py-1 font-semibold focus:outline-none cursor-pointer"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 max-w-sm w-full">
                <input
                  type="text"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  placeholder="Filter products by name..."
                  className="w-full bg-white border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreatingProduct(true);
                  setProductForm({
                    name: '',
                    slug: '',
                    tagline: '',
                    description: '',
                    category: 'Oversized',
                    fit: 'Oversized',
                    gsm: 240,
                    fabric: '100% Combed Cotton',
                    price: 799,
                    originalPrice: 1299,
                    discountPercent: 38,
                    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtT1n7LBSCxKab6XbwJ3Iq4ASwJD1qfeZzzHGEv0xFg6RVoui74Pwm1VC-yO976FlMCJtwYY-j9bTycXh4J6yGxAlYSaErjO0x9siC4YbATmLxs8qE7lZ7k9SumASJO7tqCca-eDRXiJC2LuyxkpaNf2UYpAAR9GjjHvhxZdPpsN1v68zCDxRDSwA7uR8vWK566BR1v4c66jo0LdJ_HH4_OABHxW5julaGdfAl1cv040iJ1R2kaGUh',
                    tag: '240 GSM',
                    isFeatured: true,
                  });
                }}
                className="bg-[#111111] text-white px-4 py-2.5 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#262626] transition-colors shrink-0"
              >
                + Create New Product
              </button>
            </div>

            {/* Product Edit / Create Modal */}
            {(isCreatingProduct || editingProduct) && (
              <form onSubmit={handleSaveProduct} className="bg-white p-6 rounded-xl border border-[#e5e0d8] shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
                <div className="sm:col-span-2 lg:col-span-3 pb-2 border-b border-[#f5f3f0] flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm uppercase text-[#111111]">
                    {editingProduct ? `Edit ${editingProduct.name}` : 'New Product Silhouette'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingProduct(false);
                      setEditingProduct(null);
                    }}
                    className="text-xs text-[#858383] hover:text-[#111111]"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={productForm.name || ''}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Category</label>
                  <select
                    value={productForm.category || 'Oversized'}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs"
                  >
                    <option value="Oversized">Oversized</option>
                    <option value="Graphic Tees">Graphic Tees</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Plain">Plain</option>
                    <option value="Vintage Graphic">Vintage Graphic</option>
                    <option value="Acid Wash">Acid Wash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Weight (GSM)</label>
                  <input
                    type="number"
                    value={productForm.gsm || 240}
                    onChange={(e) => setProductForm({ ...productForm, gsm: Number(e.target.value) })}
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Current Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price || 699}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Original Price (₹ INR)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice || 1299}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Tag (e.g. 240 GSM, Bestseller)</label>
                  <input
                    type="text"
                    value={productForm.tag || ''}
                    onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Image Thumbnail URL</label>
                  <input
                    type="url"
                    value={productForm.thumbnail || ''}
                    onChange={(e) => setProductForm({ ...productForm, thumbnail: e.target.value })}
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={productForm.description || ''}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2 mt-2">
                  <button
                    type="submit"
                    className="bg-[#111111] text-white px-6 py-2.5 rounded font-bold text-xs uppercase"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            )}

            {/* Product Table */}
            <div className="bg-white rounded-xl border border-[#e5e0d8] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f5f3f0] font-bold uppercase tracking-wider text-[#111111] text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Garment</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">GSM</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Stock Count</th>
                      <th className="py-2.5 px-3">Rating</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f5f3f0] text-[#111111]">
                    {products
                      .filter((p) => p.name.toLowerCase().includes(productSearchQuery.toLowerCase()))
                      .map((p) => {
                        const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);

                        return (
                          <tr key={p.id} className="hover:bg-[#fbf9f6]">
                            <td className="py-3 px-3 flex items-center gap-2.5">
                              <img src={p.thumbnail} alt={p.name} className="w-10 h-12 object-cover rounded bg-[#f5f3f0] shrink-0" />
                              <span className="font-bold">{p.name}</span>
                            </td>
                            <td className="py-3 px-3 text-[#5f615e]">{p.category}</td>
                            <td className="py-3 px-3 font-semibold">{p.gsm} GSM</td>
                            <td className="py-3 px-3 font-bold tabular-nums">₹{p.price}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                totalStock < 20 ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#dce6cd] text-[#414a37]'
                              }`}>
                                {totalStock} units
                              </span>
                            </td>
                            <td className="py-3 px-3 tabular-nums font-semibold">
                              ★ {p.rating} ({p.reviewCount})
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setProductForm(p);
                                  setIsCreatingProduct(false);
                                }}
                                className="text-xs font-bold text-[#58614e] hover:underline mr-3"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p.id)}
                                className="text-xs font-bold text-[#ba1a1a] hover:underline"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search by Order ID (TH-...) or Customer..."
                className="w-full bg-white border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none"
              />
            </div>

            <div className="bg-white rounded-xl border border-[#e5e0d8] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f5f3f0] font-bold uppercase tracking-wider text-[#111111] text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Recipient</th>
                      <th className="py-2.5 px-3">Destination</th>
                      <th className="py-2.5 px-3">Items</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Payment</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f5f3f0] text-[#111111]">
                    {orders
                      .filter(
                        (o) =>
                          o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                          o.shippingAddress.fullName.toLowerCase().includes(orderSearchQuery.toLowerCase())
                      )
                      .map((o) => (
                        <tr key={o.id} className="hover:bg-[#fbf9f6]">
                          <td className="py-3 px-3 font-mono font-bold">#{o.id}</td>
                          <td className="py-3 px-3">
                            <span className="font-semibold block">{o.shippingAddress.fullName}</span>
                            <span className="text-[10px] text-[#5f615e]">{o.shippingAddress.phone}</span>
                          </td>
                          <td className="py-3 px-3 text-[#5f615e]">
                            {o.shippingAddress.city}, {o.shippingAddress.state}
                          </td>
                          <td className="py-3 px-3 font-semibold">
                            {o.items.reduce((s, i) => s + i.quantity, 0)} garments
                          </td>
                          <td className="py-3 px-3 font-bold tabular-nums">₹{o.total}</td>
                          <td className="py-3 px-3">
                            <span className="text-[11px] block font-semibold">{o.paymentMethod}</span>
                            <span className={`text-[10px] ${o.paymentStatus === 'Paid' ? 'text-green-700 font-bold' : 'text-amber-700'}`}>
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#111111] text-white">
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                              className="bg-[#f5f3f0] border border-[#e5e0d8] rounded text-xs px-2 py-1 font-semibold focus:outline-none cursor-pointer"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-[#111111]">
                Customer Submitted Outfit Photos &amp; Reviews
              </h3>
              <span className="text-xs text-[#5f615e]">
                {reviews.filter((r) => r.status === 'approved').length} Active Reviews
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-5 rounded-xl border border-[#e5e0d8] shadow-sm flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#111111]">{rev.authorName}</span>
                        <span className="text-[#5f615e]">({rev.city})</span>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[15px] fill-1">star</span>
                        ))}
                      </div>
                    </div>

                    <p className="font-semibold text-[#58614e] text-[11px] mb-1">{rev.productName}</p>
                    <p className="text-[#111111] mb-3 leading-relaxed">"{rev.comment}"</p>

                    {rev.photoUrl && (
                      <div className="w-20 h-24 rounded overflow-hidden mb-3 border border-[#e5e0d8]">
                        <img src={rev.photoUrl} alt="Outfit review" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#f5f3f0] flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase ${
                      rev.status === 'approved' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      Status: {rev.status}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleReviewModeration(rev.id, 'approved')}
                        className="px-2.5 py-1 bg-[#dce6cd] text-[#414a37] rounded font-bold text-[11px] hover:bg-[#c0cab2]"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReviewModeration(rev.id, 'rejected')}
                        className="px-2.5 py-1 bg-[#ffdad6] text-[#93000a] rounded font-bold text-[11px] hover:bg-[#ffb4ab]"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BUSINESS SETTINGS */}
        {activeTab === 'settings' && settings && (
          <form onSubmit={handleSaveSettings} className="bg-white p-6 md:p-8 rounded-xl border border-[#e5e0d8] shadow-sm max-w-2xl flex flex-col gap-4 text-xs">
            <h3 className="font-display font-bold text-base text-[#111111] border-b border-[#f5f3f0] pb-2">
              Store Parameters &amp; Thresholds
            </h3>

            {settingsSaved && (
              <div className="p-3 bg-[#dce6cd] text-[#414a37] rounded font-bold text-xs">
                ✓ Business parameters updated successfully!
              </div>
            )}

            <div>
              <label className="block font-semibold text-[#111111] mb-1">Store Brand Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#111111] mb-1">Top Announcement Bar Text</label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#111111] mb-1">Free Shipping Threshold (₹ INR)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#111111] mb-1">Standard Shipping Fee (₹ INR)</label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.codEnabled}
                  onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                  className="accent-[#111111] rounded"
                />
                <span className="font-semibold text-[#111111]">Enable Cash on Delivery (COD)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={settings.announcementActive}
                  onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                  className="accent-[#111111] rounded"
                />
                <span className="font-semibold text-[#111111]">Show Announcement Bar</span>
              </label>
            </div>

            <div>
              <label className="block font-semibold text-[#111111] mb-1">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-[#f5f3f0]">
              <button
                type="submit"
                className="bg-[#111111] text-white px-6 py-2.5 rounded font-bold text-xs uppercase"
              >
                Save Settings
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
