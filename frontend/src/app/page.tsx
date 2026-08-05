'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { PromptCard } from '@/components/prompt/PromptCard';
import { Prompt, Category } from '@/types';
import axiosInstance from '@/lib/axiosInstance';
import { Sparkles, Search, TrendingUp, Palette, Code, PenTool, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const [trendingPrompts, setTrendingPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, categoriesRes] = await Promise.all([
          axiosInstance.get('/prompts/trending'),
          axiosInstance.get('/categories'),
        ]);
        setTrendingPrompts(trendingRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Failed to fetch homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/prompts?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    'art-design': <Palette className="w-6 h-6 text-purple-400" />,
    'coding-tech': <Code className="w-6 h-6 text-emerald-400" />,
    'writing-copywriting': <PenTool className="w-6 h-6 text-amber-400" />,
    'marketing-business': <TrendingUp className="w-6 h-6 text-cyan-400" />,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 border-b border-slate-900">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-medium mb-6 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Curated AI Prompt & Tool Sharing Directory</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
              Discover & Copy <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                High-Performance AI Prompts
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Explore curated prompts for ChatGPT, Midjourney, Claude, and Stable Diffusion. Free one-click copy with no sign-up or registration required.
            </p>

            <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto relative mb-8">
              <div className="flex items-center bg-slate-900 border border-slate-800 focus-within:border-indigo-500 rounded-2xl p-2 shadow-2xl transition">
                <Search className="w-5 h-5 text-slate-400 ml-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 'Cyberpunk portrait', 'React code reviewer', 'SEO article'..."
                  className="w-full bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
              <span className="text-slate-500">Popular AI Models:</span>
              <Link href="/prompts?aiModel=ChatGPT" className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 transition">
                ChatGPT
              </Link>
              <Link href="/prompts?aiModel=Midjourney" className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:text-purple-400 transition">
                Midjourney v6
              </Link>
              <Link href="/prompts?aiModel=Claude" className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:text-amber-400 transition">
                Claude 3.5
              </Link>
              <Link href="/prompts?aiModel=Stable+Diffusion" className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition">
                Stable Diffusion
              </Link>
            </div>

          </div>
        </section>

        {/* TOP CATEGORIES SECTION */}
        <section className="py-16 bg-slate-950/60 border-b border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Top AI Categories</h2>
                <p className="text-xs text-slate-400 mt-1">Explore prompts tailored to your specific creative domain</p>
              </div>
              <Link href="/categories" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition">
                View All Categories <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/prompts?category=${cat.slug}`}
                  className="group p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {categoryIcons[cat.slug] || <Sparkles className="w-6 h-6 text-indigo-400" />}
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition">{cat.name}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{cat.description}</p>
                  </div>
                  
                  <div className="flex items-center text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                    Explore Prompts <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* TRENDING PROMPTS SECTION */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Trending Prompts</h2>
                  <p className="text-xs text-slate-400">Most copied and viewed AI prompts</p>
                </div>
              </div>

              <Link href="/prompts" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition">
                Explore Full Directory <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-72 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingPrompts.map((prompt) => (
                  <PromptCard key={prompt._id} prompt={prompt} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* EXPLORE DIRECTORY CTA BANNER */}
        <section className="py-16 bg-slate-950 border-t border-slate-900 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 shadow-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Instant One-Click AI Prompt Copying
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mb-8 leading-relaxed">
                No sign-ups, no paywalls. Just search, copy, and paste high-engineered prompts straight into ChatGPT, Midjourney, or Claude.
              </p>

              <Link
                href="/prompts"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
              >
                Browse Full Prompt Directory <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
