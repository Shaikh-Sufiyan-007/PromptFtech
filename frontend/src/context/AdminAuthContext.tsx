'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../lib/axiosInstance';
import { AdminUser } from '../types';

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('promptseen_admin_token');
    const savedAdmin = localStorage.getItem('promptseen_admin_user');

    if (savedToken) {
      setToken(savedToken);
      if (savedAdmin) {
        try {
          setAdmin(JSON.parse(savedAdmin));
        } catch {
          // Fallback
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axiosInstance.post('/admin/login', { email, password });
    const data = response.data;

    setToken(data.token);
    setAdmin(data);

    localStorage.setItem('promptseen_admin_token', data.token);
    localStorage.setItem('promptseen_admin_user', JSON.stringify(data));
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('promptseen_admin_token');
    localStorage.removeItem('promptseen_admin_user');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
