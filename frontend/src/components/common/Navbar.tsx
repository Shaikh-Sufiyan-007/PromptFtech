'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Sparkles, Shield, LogOut, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { admin, logout } = useAdminAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Taufique<span className="text-indigo-400 font-extrabold">Verse</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/prompts" className="hover:text-white transition">Explore Directory</Link>
            <Link href="/categories" className="hover:text-white transition">Categories</Link>
          </nav>

          {/* Admin Auth Status */}
          <div className="hidden md:flex items-center gap-3">
            {admin ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition"
                >
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 hover:bg-slate-800 text-xs font-medium transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white text-xs font-medium transition"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                Admin Portal
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 text-sm">
          <Link href="/" className="block py-2 text-slate-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/prompts" className="block py-2 text-slate-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Explore Directory</Link>
          <Link href="/categories" className="block py-2 text-slate-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Categories</Link>
          {admin ? (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <Link href="/admin" className="block py-2 text-amber-400 font-semibold" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left py-2 text-rose-400">Logout</button>
            </div>
          ) : (
            <Link href="/admin/login" className="block py-2 text-indigo-400 font-semibold" onClick={() => setIsMenuOpen(false)}>Admin Portal</Link>
          )}
        </div>
      )}
    </header>
  );
};
