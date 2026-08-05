'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Prompt } from '@/types';
import axiosInstance from '@/lib/axiosInstance';
import { Copy, Check, Eye, Sparkles, Layers, Heart } from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
}

const getModelBadgeColor = (model: string) => {
  switch (model) {
    case 'Midjourney':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'ChatGPT':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Claude':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'Stable Diffusion':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    default:
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  }
};

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);
  const [copies, setCopies] = useState(prompt.copiesCount || 0);
  const [likes, setLikes] = useState(prompt.likesCount || 0);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setCopies((prev) => prev + 1);

      // Increment backend copy counter
      await axiosInstance.post(`/prompts/${prompt._id}/copy`);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy error:', err);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Increment backend like counter
      await axiosInstance.post(`/prompts/${prompt._id}/like`);
      setLikes((prev) => prev + 1);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const categoryName = typeof prompt.category === 'object' ? prompt.category.name : 'General';

  return (
    <div className="group relative flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 shadow-xl overflow-hidden hover:-translate-y-1">
      
      {/* Sample Image Preview or Header */}
      {prompt.sampleOutputUrl ? (
        <div className="relative h-44 w-full overflow-hidden bg-slate-950">
          <img
            src={prompt.sampleOutputUrl}
            alt={prompt.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
          
          {/* AI Model Pill Badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md ${getModelBadgeColor(prompt.aiModel)}`}>
              <Sparkles className="w-3 h-3" />
              {prompt.aiModel}
            </span>
          </div>
        </div>
      ) : (
        <div className="relative p-5 bg-gradient-to-br from-slate-900 to-slate-950 border-b border-slate-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getModelBadgeColor(prompt.aiModel)}`}>
              <Sparkles className="w-3 h-3" />
              {prompt.aiModel}
            </span>
          </div>
        </div>
      )}

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-indigo-400 font-medium mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>{categoryName}</span>
          </div>

          <Link href={`/prompts/${prompt._id}`}>
            <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-400 transition line-clamp-2 leading-snug">
              {prompt.title}
            </h3>
          </Link>

          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {prompt.description || prompt.content}
          </p>
        </div>

        {/* Tags */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {prompt.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] text-slate-300 font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              {prompt.viewsCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              {copies}
            </span>
            <span className="flex items-center gap-1 cursor-pointer" onClick={handleLike}>
              <Heart className="w-3.5 h-3.5 text-slate-500" />
              {likes}
            </span>
          </div>

          {/* One-Click Copy Prompt Button */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              copied
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Prompt
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
