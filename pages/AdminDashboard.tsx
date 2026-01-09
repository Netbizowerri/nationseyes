
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Post, Comment } from '../types';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setPosts(await storageService.getPosts());
      setComments(await storageService.getComments());
    };
    loadData();
  }, []);

  const stats = [
    { name: 'Total Posts', value: posts.length, icon: 'fa-newspaper', color: 'blue' },
    { name: 'Total Comments', value: comments.length, icon: 'fa-comments', color: 'purple' },
    { name: 'Pending Moderation', value: comments.filter(c => !c.isApproved).length, icon: 'fa-clock', color: 'orange' },
    { name: 'Drafts', value: posts.filter(p => p.status === 'draft').length, icon: 'fa-file-pen', color: 'slate' },
  ];

  const chartData = [
    { name: 'May 1', posts: 2 },
    { name: 'May 5', posts: 5 },
    { name: 'May 10', posts: 3 },
    { name: 'May 15', posts: 8 },
    { name: 'May 20', posts: 4 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Dashboard Overview</h2>
        <Link to="/admin/posts/new" className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200">
          <i className="fas fa-plus mr-2"></i> New Article
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white shadow-lg bg-${stat.color}-500`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Article Publishing Activity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                <YAxis axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="posts" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Pending Moderation</h3>
          <div className="space-y-4">
            {comments.filter(c => !c.isApproved).slice(0, 5).map(comment => (
              <div key={comment.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900">{comment.authorName}</span>
                  <span className="text-[10px] text-slate-400">{new Date(comment.date).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{comment.content}</p>
                <div className="flex space-x-2 mt-3">
                  <button className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded font-bold hover:bg-green-200">Approve</button>
                  <button className="text-[10px] px-2 py-1 bg-red-100 text-red-700 rounded font-bold hover:bg-red-200">Reject</button>
                </div>
              </div>
            ))}
            {comments.filter(c => !c.isApproved).length === 0 && (
              <p className="text-slate-400 text-sm italic text-center py-10">No pending comments.</p>
            )}
          </div>
          <Link to="/admin/comments" className="block text-center mt-6 text-sm font-bold text-slate-500 hover:text-red-600 transition-colors">
            View All Comments
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
