
import React from 'react';
import { Post } from '../types';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  post: Post;
  isHero?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ post, isHero }) => {
  if (isHero) {
    return (
      <Link to={`/post/${post.id}`} className="group relative block w-full h-[600px] overflow-hidden rounded-[2.5rem] shadow-2xl mb-16 no-underline bg-black">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-10 md:p-16 w-full max-w-5xl">
          <span className="inline-block px-4 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 shadow-xl">
            {post.category}
          </span>
          <h2 className="text-4xl md:text-6xl font-[900] text-white mb-6 group-hover:text-red-500 transition-all duration-300 tracking-tighter leading-tight drop-shadow-2xl">
            {post.title}
          </h2>
          <p className="text-gray-300 text-lg line-clamp-2 max-w-3xl mb-8 font-light leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex items-center text-xs text-white/60 space-x-6 font-bold uppercase tracking-widest">
            <span className="flex items-center"><i className="far fa-user mr-2 text-red-500"></i> {post.author}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span>{new Date(post.date).toLocaleDateString()}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span className="flex items-center"><i className="far fa-clock mr-2 text-red-500"></i> {post.readTime}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/post/${post.id}`} className="group bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 hover:-translate-y-2 no-underline">
      <div className="h-64 overflow-hidden relative">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
           <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-xl font-black mb-4 group-hover:text-red-600 transition-all duration-300 line-clamp-2 leading-snug text-slate-900 uppercase">
          {post.title}
        </h3>
        <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed font-light">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>{new Date(post.date).toLocaleDateString()}</span>
          <span className="flex items-center group-hover:text-red-600 transition-colors">
            <i className="far fa-clock mr-2"></i> {post.readTime}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
