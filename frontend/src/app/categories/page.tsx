'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Category } from '@/types';
import axiosInstance from '@/lib/axiosInstance';
import { Layers, Sparkles, ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-7 h-7 text-indigo-400" />
              Prompt Categories
            </h1>
            <p className="text-xs text-slate-400 mt-1">Browse AI prompts organized by industry and use-case</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-44 bg-slate-900 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4 hover:border-indigo-500/40 transition shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      {cat.name}
                    </h3>
                    <Link
                      href={`/prompts?category=${cat.slug}`}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      Browse Prompts <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{cat.description || 'Curated AI prompts for this category.'}</p>

                  {cat.tags && cat.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {cat.tags.map((t, idx) => (
                        <Link
                          key={idx}
                          href={`/prompts?tag=${encodeURIComponent(t.slug)}`}
                          className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300 hover:border-indigo-500 transition"
                        >
                          #{t.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
