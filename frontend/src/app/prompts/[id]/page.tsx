'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Prompt } from '@/types';
import axiosInstance from '@/lib/axiosInstance';
import { Sparkles, Copy, Check, Eye, ArrowLeft, Sliders, Layers } from 'lucide-react';

export default function PromptDetailPage() {
  const params = useParams();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [copied, setCopied] = useState(false);
  const [copies, setCopies] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await axiosInstance.get(`/prompts/${params.id}`);
        setPrompt(res.data);
        setCopies(res.data.copiesCount);
      } catch (err) {
        console.error('Error fetching prompt details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) {
      fetchPrompt();
    }
  }, [params.id]);

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setCopies((prev) => prev + 1);

      await axiosInstance.post(`/prompts/${prompt._id}/copy`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full">
          <div className="h-96 bg-slate-900 rounded-3xl border border-slate-800 animate-pulse" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col text-white">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold">Prompt Not Found</h2>
          <Link href="/prompts" className="mt-4 inline-block px-4 py-2 bg-indigo-600 rounded-lg text-xs font-semibold">
            Return to Directory
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryObj = typeof prompt.category === 'object' ? prompt.category : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back Button */}
          <Link
            href="/prompts"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Prompts Directory
          </Link>

          {/* Main Card Wrapper */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-10 space-y-8">

            {/* Header Title & Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {prompt.aiModel}
                </span>

                {categoryObj && (
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    {categoryObj.name}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {prompt.title}
              </h1>

              <div className="flex items-center gap-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Eye className="w-4 h-4 text-slate-500" /> {prompt.viewsCount} views</span>
                <span className="flex items-center gap-1"><Copy className="w-4 h-4 text-slate-500" /> {copies} copies</span>
              </div>
            </div>

            {/* RAW PROMPT TEXT DISPLAY BOX */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Prompt Copy Box</h3>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${copied
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      One-Click Copy Prompt
                    </>
                  )}
                </button>
              </div>

              <div className="relative p-5 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto selection:bg-indigo-500 selection:text-white">
                <pre className="whitespace-pre-wrap font-mono">{prompt.content}</pre>
              </div>
            </div>

            {/* PARAMETERS SECTION */}
            {prompt.parameters && Object.values(prompt.parameters).some((v) => v !== null && v !== undefined) && (
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  Engineered Prompt Parameters
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  {prompt.parameters.version && (
                    <div>
                      <span className="text-slate-500 block">Model Version</span>
                      <span className="font-semibold text-slate-200">{prompt.parameters.version}</span>
                    </div>
                  )}
                  {prompt.parameters.aspectRatio && (
                    <div>
                      <span className="text-slate-500 block">Aspect Ratio</span>
                      <span className="font-semibold text-slate-200">{prompt.parameters.aspectRatio}</span>
                    </div>
                  )}
                  {prompt.parameters.temperature !== undefined && (
                    <div>
                      <span className="text-slate-500 block">Temperature</span>
                      <span className="font-semibold text-slate-200">{prompt.parameters.temperature}</span>
                    </div>
                  )}
                  {prompt.parameters.seed && (
                    <div>
                      <span className="text-slate-500 block">Seed Number</span>
                      <span className="font-semibold text-slate-200">{prompt.parameters.seed}</span>
                    </div>
                  )}
                </div>

                {prompt.parameters.negativePrompt && (
                  <div className="pt-2 border-t border-slate-900">
                    <span className="text-slate-500 text-xs block mb-1">Negative Prompt / Exclusions</span>
                    <p className="text-xs font-mono text-rose-300 bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/30">
                      {prompt.parameters.negativePrompt}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* DESCRIPTION & SAMPLE OUTPUT IMAGE */}
            {prompt.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-200">Overview & Instructions</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{prompt.description}</p>
              </div>
            )}

            {prompt.sampleOutputUrl && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold text-slate-200">Sample Generated Output</h3>
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-96">
                  <img
                    src={prompt.sampleOutputUrl}
                    alt={prompt.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* TAGS */}
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500">Tags:</span>
                {prompt.tags.map((tag, idx) => (
                  <Link
                    key={idx}
                    href={`/prompts?tag=${encodeURIComponent(tag)}`}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-[11px] text-slate-300 hover:text-white transition font-mono"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
