'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { PromptCard } from '@/components/prompt/PromptCard';
import { PromptFilter } from '@/components/prompt/PromptFilter';
import { Prompt, Category } from '@/types';
import axiosInstance from '@/lib/axiosInstance';
import { Sparkles, Layers } from 'lucide-react';

export default function PromptsDirectoryPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrompts, setTotalPrompts] = useState(0);

  // Parse initial query params if present in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('search')) setSearchQuery(params.get('search') || '');
      if (params.get('aiModel')) setSelectedModel(params.get('aiModel') || '');
      if (params.get('category')) setSelectedCategory(params.get('category') || '');
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchPrompts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = { sort: sortBy };
      if (searchQuery) params.search = searchQuery;
      if (selectedModel) params.aiModel = selectedModel;
      if (selectedCategory) params.category = selectedCategory;

      const res = await axiosInstance.get('/prompts', { params });
      setPrompts(res.data.prompts);
      setTotalPrompts(res.data.total);
    } catch (err) {
      console.error('Failed to fetch prompts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedModel, selectedCategory, sortBy]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrompts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchPrompts]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-indigo-400" />
              AI Prompt Directory
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Explore {totalPrompts} curated prompts for ChatGPT, Midjourney, Claude, and Stable Diffusion
            </p>
          </div>

          {/* Filter Bar Component */}
          <PromptFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
          />

          {/* Prompts Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : prompts.length === 0 ? (
            <div className="py-20 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80">
              <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">No Prompts Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No prompts matched your search filters. Try adjusting your search term or clearing model filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedModel('');
                  setSelectedCategory('');
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt) => (
                <PromptCard key={prompt._id} prompt={prompt} />
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
