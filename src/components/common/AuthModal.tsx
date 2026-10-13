import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email);
      } else {
        await register(name, email, phone);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomer = async () => {
    setLoading(true);
    await login('arjun.k@example.com', 'customer');
    setLoading(false);
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    await login('admin@teehub.in', 'admin');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-xl shadow-2xl border border-[#e5e0d8] overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between bg-[#fbf9f6] border-b border-[#e5e0d8]">
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg text-[#111111] uppercase tracking-tight">
              {mode === 'login' ? 'Sign In to TEE HUB' : 'Create an Account'}
            </span>
            <span className="text-[11px] text-[#5f615e]">
              Access order tracking, secret drop links, and wishlist
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 text-[#858383] hover:text-[#111111] rounded"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          {/* Quick Demo Shortcuts */}
          <div className="bg-[#f5f3f0] p-3 rounded-lg flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#858383]">
              Quick Access Demo Accounts:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoCustomer}
                className="bg-white hover:bg-[#eae8e5] border border-[#e5e0d8] py-1.5 px-2 rounded text-xs font-semibold text-[#111111] transition-colors"
              >
                👤 Demo Customer
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="bg-[#111111] hover:bg-[#262626] text-white py-1.5 px-2 rounded text-xs font-bold transition-colors"
              >
                ⚡ Store Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arjun Kapoor"
                  className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none focus:border-[#111111]"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">Mobile (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#fbf9f6] border border-[#e5e0d8] px-3 py-2 rounded text-xs focus:outline-none focus:border-[#111111]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-[#111111] text-white py-3 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#262626] transition-colors disabled:opacity-50"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-xs text-[#5f615e] pt-2 border-t border-[#f5f3f0]">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-[#111111] hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#111111] hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
