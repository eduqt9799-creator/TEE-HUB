import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ShippingAddress } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, role?: 'customer' | 'admin') => Promise<void>;
  register: (name: string, email: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addAddress: (address: ShippingAddress) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'teehub_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      // Default initial mock logged-in customer matching the sample
      return {
        id: 'usr-demo-01',
        name: 'Arjun K.',
        email: 'arjun.k@example.com',
        phone: '+91 98765 43210',
        role: 'customer',
        savedAddresses: [
          {
            fullName: 'Arjun K.',
            phone: '+91 98765 43210',
            email: 'arjun.k@example.com',
            addressLine1: 'Flat 402, Oakwood Enclave, 12th Main',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560038',
          },
        ],
        createdAt: '2026-01-15T08:00:00Z',
      };
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, role: 'customer' | 'admin' = 'customer') => {
    // If admin email or role requested
    const isAdminUser = email.toLowerCase().includes('admin') || role === 'admin';
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: isAdminUser ? 'Store Administrator' : email.split('@')[0],
      email,
      role: isAdminUser ? 'admin' : 'customer',
      savedAddresses: [],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const register = async (name: string, email: string, phone?: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer',
      savedAddresses: [],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  const addAddress = (address: ShippingAddress) => {
    if (!user) return;
    setUser({
      ...user,
      savedAddresses: [...user.savedAddresses, address],
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
