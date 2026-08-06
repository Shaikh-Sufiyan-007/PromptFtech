import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span>Taufique Verse</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The open directory for discovering, filtering, and copying high-performing AI prompts for ChatGPT, Midjourney, Claude, and Stable Diffusion.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">AI Models</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/prompts?aiModel=ChatGPT" className="hover:text-indigo-400 transition">ChatGPT Prompts</Link></li>
            <li><Link href="/prompts?aiModel=Midjourney" className="hover:text-indigo-400 transition">Midjourney v6</Link></li>
            <li><Link href="/prompts?aiModel=Claude" className="hover:text-indigo-400 transition">Claude 3.5 Sonnet</Link></li>
            <li><Link href="/prompts?aiModel=Stable+Diffusion" className="hover:text-indigo-400 transition">Stable Diffusion XL</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/prompts?category=art-design" className="hover:text-indigo-400 transition">Art & Design</Link></li>
            <li><Link href="/prompts?category=coding-tech" className="hover:text-indigo-400 transition">Coding & Architecture</Link></li>
            <li><Link href="/prompts?category=writing-copywriting" className="hover:text-indigo-400 transition">Copywriting & SEO</Link></li>
            <li><Link href="/prompts?category=marketing-business" className="hover:text-indigo-400 transition">Marketing & Pitch</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Admin Access</h4>
          <p className="text-xs text-slate-400 mb-3">
            Protected management portal for directory administration and content curation.
          </p>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            Admin Login Portal
          </Link>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Taufique Verse Directory. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for AI Creators</span>
        </div>
      </div>
    </footer>
  );
};
