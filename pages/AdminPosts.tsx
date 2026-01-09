
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { geminiService } from '../services/geminiService';
import { newsAgentService } from '../services/newsAgentService';
import { Post, Category } from '../types';

const AdminPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importText, setImportText] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'writer' | 'agent' | 'editor'>('writer');
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      setPosts(await storageService.getPosts());
    };
    loadPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await storageService.deletePost(id);
      setPosts(await storageService.getPosts());
    }
  };

  const handleWriterGenerate = async () => {
    if (!importText.trim()) return;
    setIsImporting(true);
    const result = await geminiService.generatePostFromTopic(importText);
    setIsImporting(false);

    if (result) {
      setEditingPost(result as Post);
      setImportText('');
      setActiveTab('editor');
    } else {
      alert('Failed to generate content. Please try again.');
    }
  };

  const handleSyncCNN = async () => {
    setIsSyncing(true);
    try {
      const newPost = await newsAgentService.syncCnnWorldNews();
      if (newPost) {
        setPosts(await storageService.getPosts());
        alert('World News Agent successfully synced and published a new article from CNN!');
        setIsModalOpen(false);
      }
    } catch (e) {
      alert('Failed to sync from CNN. Please check your connection.');
    } finally {
      setIsSyncing(false);
    }
  };

  const savePost = async () => {
    if (editingPost && editingPost.title) {
      await storageService.savePost(editingPost as Post);
      setPosts(await storageService.getPosts());
      setEditingPost(null);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Manage Articles</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => { setEditingPost(null); setActiveTab('writer'); setIsModalOpen(true); }}
            className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-200 border border-slate-300"
          >
            <i className="fas fa-brain mr-2"></i> AI Studio
          </button>
          <button
            onClick={() => { setEditingPost({ id: Date.now().toString(), status: 'draft', author: 'Noel Chiagorom', date: new Date().toISOString().split('T')[0] } as Post); setIsModalOpen(true); }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200"
          >
            <i className="fas fa-plus mr-2"></i> Manual Entry
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Article</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <img src={post.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
                    <div>
                      <p className="text-sm font-bold text-slate-900 line-clamp-1">{post.title}</p>
                      <p className="text-xs text-slate-400">By {post.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{post.category}</span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {post.date}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => { setEditingPost(post); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600"><i className="fas fa-edit"></i></button>
                  <button onClick={() => handleDelete(post.id)} className="p-2 text-slate-400 hover:text-red-600"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingPost?.id ? 'Edit Article' : 'AI Studio'}
              </h3>
              <button onClick={() => { setIsModalOpen(false); setEditingPost(null); }} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times"></i></button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
              {!editingPost ? (
                <div className="space-y-6">
                  <div className="flex border-b border-slate-100">
                    <button
                      onClick={() => setActiveTab('writer')}
                      className={`pb-4 px-6 text-sm font-bold transition-colors border-b-2 ${activeTab === 'writer' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-400'}`}
                    >
                      AI Journalist Writer
                    </button>
                    <button
                      onClick={() => setActiveTab('agent')}
                      className={`pb-4 px-6 text-sm font-bold transition-colors border-b-2 ${activeTab === 'agent' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-400'}`}
                    >
                      World News Agent (CNN)
                    </button>
                  </div>

                  {activeTab === 'writer' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <p className="text-sm text-slate-500">
                        Enter a topic or a brief prompt. Gemini will research and write a full 400-word investigative article for "The Nation's Eyes", including optimized prompts for Nano Banana images.
                      </p>
                      <textarea
                        rows={8}
                        className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-sans text-sm"
                        placeholder="e.g. The rising influence of AI in West African tech hubs..."
                        value={importText}
                        onChange={e => setImportText(e.target.value)}
                      ></textarea>
                      <button
                        onClick={handleWriterGenerate}
                        disabled={isImporting}
                        className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center shadow-lg"
                      >
                        {isImporting ? <><i className="fas fa-spinner fa-spin mr-2"></i> Generating Content...</> : <><i className="fas fa-pen-nib mr-2"></i> Write Article with Gemini</>}
                      </button>
                    </div>
                  )}

                  {activeTab === 'agent' && (
                    <div className="space-y-6 py-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-globe-africa text-3xl text-red-600"></i>
                      </div>
                      <div className="max-w-md mx-auto">
                        <h4 className="text-lg font-bold text-slate-900 mb-2">Automated World News Agent</h4>
                        <p className="text-sm text-slate-500 mb-8">
                          The agent will scrape the current front page of <strong>CNN World</strong>, identify the top breaking story, and automatically write and publish a professional article.
                        </p>
                        <button
                          onClick={handleSyncCNN}
                          disabled={isSyncing}
                          className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center shadow-xl shadow-red-200"
                        >
                          {isSyncing ? <><i className="fas fa-sync fa-spin mr-2"></i> Syncing from CNN...</> : <><i className="fas fa-bolt mr-2"></i> Trigger News Agent Sync</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                      value={editingPost.title || ''}
                      onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                      <select
                        className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                        value={editingPost.category || Category.EDITORIAL}
                        onChange={e => setEditingPost({ ...editingPost, category: e.target.value as Category })}
                      >
                        {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Status</label>
                      <select
                        className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                        value={editingPost.status || 'draft'}
                        onChange={e => setEditingPost({ ...editingPost, status: e.target.value as any })}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Excerpt</label>
                    <textarea
                      rows={2}
                      className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                      value={editingPost.excerpt || ''}
                      onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Content</label>
                    <textarea
                      rows={10}
                      className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                      value={editingPost.content || ''}
                      onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="flex space-x-4 pt-6">
                    <button
                      onClick={() => setEditingPost(null)}
                      className="flex-1 bg-slate-100 text-slate-700 p-3 rounded-lg font-bold"
                    >
                      Back
                    </button>
                    <button
                      onClick={savePost}
                      className="flex-2 bg-red-600 text-white p-3 rounded-lg font-bold flex-grow hover:bg-red-700"
                    >
                      Save Article
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPosts;
