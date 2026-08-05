'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAdminAuth } from '@/context/AdminAuthContext';
import axiosInstance from '@/lib/axiosInstance';
import { AnalyticsStats, Prompt, Category } from '@/types';
import { Shield, Layers, Plus, Trash2, Edit3, Sparkles, Eye, Copy, X, Check, Search } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { admin, isLoading: isAuthLoading } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'prompts' | 'categories'>('prompts');
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [promptsList, setPromptsList] = useState<Prompt[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Create/Edit Prompt
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [aiModel, setAiModel] = useState<'ChatGPT' | 'Midjourney' | 'Claude' | 'Stable Diffusion' | 'DALL-E' | 'Gemini' | 'Other'>('ChatGPT');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [sampleOutputUrl, setSampleOutputUrl] = useState('');
  const [aspectRatio, setAspectRatio] = useState('');
  const [version, setVersion] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [temperature, setTemperature] = useState('');

  // Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!admin) {
        router.push('/admin/login');
        return;
      }
      fetchAdminData();
    }
  }, [admin, isAuthLoading, router]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, promptsRes, catRes] = await Promise.all([
        axiosInstance.get('/admin/analytics'),
        axiosInstance.get('/prompts?limit=100'),
        axiosInstance.get('/categories'),
      ]);
      setStats(statsRes.data);
      setPromptsList(promptsRes.data.prompts || []);
      setCategoriesList(catRes.data);
      if (catRes.data.length > 0) setCategoryId(catRes.data[0]._id);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPromptId(null);
    setTitle('');
    setAiModel('ChatGPT');
    if (categoriesList.length > 0) setCategoryId(categoriesList[0]._id);
    setTags('');
    setContent('');
    setDescription('');
    setSampleOutputUrl('');
    setAspectRatio('');
    setVersion('');
    setNegativePrompt('');
    setTemperature('');
    setIsModalOpen(true);
  };

  const openEditModal = (prompt: Prompt) => {
    setEditingPromptId(prompt._id);
    setTitle(prompt.title);
    setAiModel(prompt.aiModel);
    setCategoryId(typeof prompt.category === 'object' ? prompt.category._id : prompt.category);
    setTags(prompt.tags ? prompt.tags.join(', ') : '');
    setContent(prompt.content);
    setDescription(prompt.description || '');
    setSampleOutputUrl(prompt.sampleOutputUrl || '');
    setAspectRatio(prompt.parameters?.aspectRatio || '');
    setVersion(prompt.parameters?.version || '');
    setNegativePrompt(prompt.parameters?.negativePrompt || '');
    setTemperature(prompt.parameters?.temperature !== undefined ? String(prompt.parameters.temperature) : '');
    setIsModalOpen(true);
  };

  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        aiModel,
        category: categoryId,
        tags: tags ? tags.split(',').map((t) => t.trim()) : [],
        content,
        description,
        sampleOutputUrl,
        parameters: {
          aspectRatio: aspectRatio || undefined,
          version: version || undefined,
          negativePrompt: negativePrompt || undefined,
          temperature: temperature ? parseFloat(temperature) : undefined,
        },
      };

      if (editingPromptId) {
        const res = await axiosInstance.put(`/admin/prompts/${editingPromptId}`, payload);
        setPromptsList((prev) => prev.map((p) => (p._id === editingPromptId ? res.data : p)));
      } else {
        const res = await axiosInstance.post('/admin/prompts', payload);
        setPromptsList([res.data, ...promptsList]);
      }

      setIsModalOpen(false);
      fetchAdminData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save prompt');
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    if (!confirm('Are you sure you want to permanently delete this prompt?')) return;
    try {
      await axiosInstance.delete(`/admin/prompts/${promptId}`);
      setPromptsList((prev) => prev.filter((p) => p._id !== promptId));
      if (stats) setStats({ ...stats, totalPrompts: stats.totalPrompts - 1 });
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      const res = await axiosInstance.post('/categories', { name: newCatName, description: newCatDesc });
      setCategoriesList([...categoriesList, res.data]);
      setNewCatName('');
      setNewCatDesc('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await axiosInstance.delete(`/categories/${catId}`);
      setCategoriesList((prev) => prev.filter((c) => c._id !== catId));
    } catch (err) {
      console.error('Delete category failed:', err);
    }
  };

  const filteredPrompts = promptsList.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.aiModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 w-full text-center">
          <div className="h-64 bg-slate-900 rounded-3xl animate-pulse" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Shield className="w-7 h-7 text-amber-400" />
                Single Admin Directory Portal
              </h1>
              <p className="text-xs text-slate-400 mt-1">Logged in as <strong className="text-slate-200">{admin?.email}</strong></p>
            </div>

            <button
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              <Plus className="w-4 h-4" />
              Add New Prompt
            </button>
          </div>

          {/* ANALYTICS METRICS */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                <span className="text-slate-400 text-[11px] block">Total Prompts</span>
                <span className="text-2xl font-bold text-indigo-400">{stats.totalPrompts}</span>
              </div>
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                <span className="text-slate-400 text-[11px] block">Categories</span>
                <span className="text-2xl font-bold text-purple-400">{stats.totalCategories}</span>
              </div>
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                <span className="text-slate-400 text-[11px] block">Total Views</span>
                <span className="text-2xl font-bold text-emerald-400">{stats.totalViews}</span>
              </div>
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                <span className="text-slate-400 text-[11px] block">Total Copies</span>
                <span className="text-2xl font-bold text-cyan-400">{stats.totalCopies}</span>
              </div>
            </div>
          )}

          {/* TABS */}
          <div className="flex border-b border-slate-800 mb-6 gap-6">
            <button
              onClick={() => setActiveTab('prompts')}
              className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'prompts'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Prompt Management ({promptsList.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'categories'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Categories & Tags ({categoriesList.length})
            </button>
          </div>

          {/* PROMPTS CRUD TAB */}
          {activeTab === 'prompts' && (
            <div className="space-y-4">
              
              {/* Filter / Search Bar */}
              <div className="relative max-w-md mb-4">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter prompts by title or AI model..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              {/* Table */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="px-6 py-3">Prompt Title</th>
                        <th className="px-6 py-3">AI Model</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3">Views</th>
                        <th className="px-6 py-3">Copies</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredPrompts.map((p) => {
                        const catName = typeof p.category === 'object' ? p.category.name : 'General';
                        return (
                          <tr key={p._id} className="hover:bg-slate-800/40 transition">
                            <td className="px-6 py-4 font-semibold text-white max-w-xs truncate">{p.title}</td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold text-[10px]">
                                {p.aiModel}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-400">{catName}</td>
                            <td className="px-6 py-4">{p.viewsCount}</td>
                            <td className="px-6 py-4">{p.copiesCount}</td>
                            <td className="px-6 py-4 text-right space-x-2">
                              <button
                                onClick={() => openEditModal(p)}
                                className="p-1.5 text-indigo-400 hover:bg-indigo-500/10 rounded transition"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePrompt(p._id)}
                                className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              
              <form onSubmit={handleCreateCategory} className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-400" />
                  Add Category
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Category Name (e.g. SEO Copywriting)"
                    className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                  <input
                    type="text"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Short description"
                    className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">
                  Create Category
                </button>
              </form>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Slug</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {categoriesList.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4 font-semibold text-white">{c.name}</td>
                        <td className="px-6 py-4 font-mono text-slate-400">{c.slug}</td>
                        <td className="px-6 py-4 text-slate-400">{c.description || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteCategory(c._id)}
                            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* CREATE / EDIT PROMPT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingPromptId ? 'Edit Prompt' : 'Create New Prompt'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrompt} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">AI Model *</label>
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="ChatGPT">ChatGPT</option>
                    <option value="Midjourney">Midjourney</option>
                    <option value="Claude">Claude</option>
                    <option value="Stable Diffusion">Stable Diffusion</option>
                    <option value="DALL-E">DALL-E</option>
                    <option value="Gemini">Gemini</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    {categoriesList.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="photorealism, portrait"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Prompt Copy Text *</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                />
              </div>

              {/* Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Version</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="v6.0"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Aspect Ratio</label>
                  <input
                    type="text"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    placeholder="--ar 16:9"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Temperature</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="0.7"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Image Preview URL</label>
                  <input
                    type="url"
                    value={sampleOutputUrl}
                    onChange={(e) => setSampleOutputUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  {editingPromptId ? 'Update Prompt' : 'Create Prompt'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
