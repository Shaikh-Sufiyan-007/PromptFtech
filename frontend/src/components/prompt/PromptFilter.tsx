'use client';

import React from 'react';
import { Search, Filter, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Category } from '@/types';

interface PromptFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  categories: Category[];
}

const AI_MODELS = ['All', 'ChatGPT', 'Midjourney', 'Claude', 'Stable Diffusion', 'DALL-E', 'Gemini'];

export const PromptFilter: React.FC<PromptFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedModel,
  setSelectedModel,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 md:p-6 mb-8 space-y-5 backdrop-blur-md shadow-xl">
      
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search prompts by title, keywords, parameters, or tags..."
          className="w-full pl-12 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-sm"
        />
      </div>

      {/* AI Model Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Model:
        </span>
        {AI_MODELS.map((model) => (
          <button
            key={model}
            onClick={() => setSelectedModel(model === 'All' ? '' : model)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
              (model === 'All' && !selectedModel) || selectedModel === model
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-950/60 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {model}
          </button>
        ))}
      </div>

      {/* Category Dropdown & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
        
        {/* Category Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-56 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="latest">Latest</option>
            <option value="popular">Most Copied / Popular</option>
            <option value="liked">Most Liked</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

      </div>

    </div>
  );
};
