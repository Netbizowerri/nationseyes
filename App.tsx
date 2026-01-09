import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminPosts from './pages/AdminPosts';
import AdminComments from './pages/AdminComments';
import Login from './pages/Login';
import { storageService } from './services/storageService';
import { User, Post, Category } from './types';

const EyeLogo = () => (
  <Link to="/" className="relative w-24 h-12 md:w-36 md:h-18 flex items-center justify-center select-none cursor-pointer block group transition-transform duration-300 hover:scale-110">
    <svg viewBox="0 0 100 50" className="w-full h-full drop-shadow-lg overflow-visible">
      <path
        d="M5,25 Q20,5 50,5 T95,25 Q80,45 50,45 T5,25"
        fill="white"
        stroke="black"
        strokeWidth="3"
        className="group-hover:stroke-red-600 transition-colors duration-300"
      />
      <circle cx="50" cy="25" r="16" fill="black" />
      <g transform="translate(42, 17) scale(0.16)">
        <path
          d="M10,40 C10,35 15,30 20,25 C25,20 30,22 40,20 C50,18 60,15 70,20 C80,25 85,35 90,45 C95,55 85,75 75,85 C65,95 50,90 40,88 C30,86 15,80 10,65 Z"
          fill="white"
        />
        <circle cx="55" cy="45" r="8" fill="#15803d" />
      </g>
    </svg>
  </Link>
);

const NewspaperHeader = () => {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const location = useLocation();

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await storageService.getPosts();
      const latest = posts
        .filter(p => p.status === 'published')
        .slice(0, 5);
      setLatestPosts(latest);
    };
    fetchPosts();
  }, [location.pathname]);

  return (
    <header className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dynamic Ticker Bar */}
        <div className="border-t-[4px] border-b-[1px] border-black py-2 overflow-hidden bg-slate-50">
          <div className="relative flex whitespace-nowrap">
            <div className="animate-ticker flex space-x-12 items-center">
              {latestPosts.length > 0 ? (
                latestPosts.map(post => (
                  <Link key={post.id} to={`/post/${post.id}`} className="text-[11px] md:text-sm font-black tracking-tight text-slate-900 uppercase italic hover:text-red-600 transition-colors">
                    {post.category}: {post.title}
                  </Link>
                ))
              ) : (
                <span className="text-[11px] md:text-sm font-black tracking-tight text-slate-900 uppercase italic">
                  WELCOME TO THE NATION'S EYES - SEEING BEYOND THE HEADLINES
                </span>
              )}
            </div>
            {/* Duplicate for seamless looping if content is short, usually handled by CSS for long lists */}
            <div className="animate-ticker flex space-x-12 items-center pl-12" aria-hidden="true">
              {latestPosts.map(post => (
                <Link key={`copy-${post.id}`} to={`/post/${post.id}`} className="text-[11px] md:text-sm font-black tracking-tight text-slate-900 uppercase italic hover:text-red-600 transition-colors">
                  {post.category}: {post.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Masthead Banner */}
        <div className="bg-[#cc2121] px-6 py-8 md:py-12 flex flex-col md:flex-row items-center justify-center border-y-4 border-black/5 shadow-2xl rounded-b-3xl mt-2 transition-all duration-500">
          <div className="flex flex-col md:flex-row items-center justify-center space-x-0 md:space-x-12">
            <div className="mb-8 md:mb-0">
              <EyeLogo />
            </div>

            <div className="text-center md:text-left">
              <Link to="/" className="block">
                <h1 className="text-white text-5xl md:text-8xl font-[900] leading-none tracking-tighter select-none drop-shadow-[0_8px_8px_rgba(0,0,0,0.4)] transition-all">
                  THE NATION'S EYES
                </h1>
              </Link>
              <div className="flex flex-col items-center md:items-end -mt-1 md:-mt-3">
                <div className="w-full h-[5px] bg-white mb-1 shadow-md rounded-full"></div>
                <p className="text-white text-[12px] md:text-lg font-bold tracking-[0.5em] uppercase italic opacity-90">
                  Seeing Beyond The Headlines
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Date Bar */}
        <div className="flex justify-center items-center py-4 border-b border-slate-100 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
          <span>{dateStr}</span>
        </div>
      </div>
    </header>
  );
};

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NewspaperHeader />
      <main className="flex-grow animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {children}
      </main>
      <footer className="bg-slate-950 text-white py-20 mt-12 border-t-8 border-red-700 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <EyeLogo />
          </div>
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <h2 className="text-4xl font-[900] mb-4 tracking-tighter text-white">THE NATION'S EYES</h2>
          </Link>
          <p className="text-slate-400 mb-10 max-w-md mx-auto italic text-lg font-light">"Unveiling truths, shaping perspectives."</p>
          <div className="flex justify-center space-x-10 mb-12">
            <a href="#" className="text-3xl text-slate-500 hover:text-white transition-all transform hover:-translate-y-1"><i className="fab fa-facebook"></i></a>
            <a href="#" className="text-3xl text-slate-500 hover:text-white transition-all transform hover:-translate-y-1"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-3xl text-slate-500 hover:text-white transition-all transform hover:-translate-y-1"><i className="fab fa-instagram"></i></a>
          </div>
          <div className="w-16 h-1 bg-red-700 mx-auto mb-10 rounded-full"></div>
          <p className="text-slate-600 text-[10px] uppercase tracking-[0.4em] font-bold">© 2024 The Nation's Eyes. All rights reserved. Managed by Noel Chiagorom.</p>
        </div>
      </footer>
    </div>
  );
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(storageService.getAuth());
  const location = useLocation();

  if (!user || !user.isLoggedIn) {
    return <Navigate to="/adminlogin" state={{ from: location }} replace />;
  }

  const handleLogout = () => {
    storageService.setAuth(null);
    setUser(null);
  };

  return (
    <div className="min-h-screen flex bg-[#f1f5f9]">
      <aside className="w-72 bg-slate-950 text-white flex flex-col fixed h-full shadow-2xl z-50">
        <div className="p-8 border-b border-white/5 bg-slate-950">
          <Link to="/" className="block group">
            <h1 className="text-xl font-black italic tracking-tighter group-hover:text-red-500 transition-colors">THE NATION'S EYES</h1>
          </Link>
          <p className="text-[10px] text-red-500 uppercase tracking-[0.3em] font-bold mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-grow p-6 space-y-3 mt-4">
          <Link to="/admin" className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 font-bold text-sm ${location.pathname === '/admin' ? 'bg-red-600 text-white shadow-xl shadow-red-900/50 scale-105' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
            <i className="fas fa-chart-pie w-5"></i>
            <span>Overview</span>
          </Link>
          <Link to="/admin/posts" className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 font-bold text-sm ${location.pathname === '/admin/posts' ? 'bg-red-600 text-white shadow-xl shadow-red-900/50 scale-105' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
            <i className="fas fa-newspaper w-5"></i>
            <span>Manage Posts</span>
          </Link>
          <Link to="/admin/comments" className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 font-bold text-sm ${location.pathname === '/admin/comments' ? 'bg-red-600 text-white shadow-xl shadow-red-900/50 scale-105' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
            <i className="fas fa-comments w-5"></i>
            <span>Comments</span>
          </Link>
        </nav>
        <div className="p-6 border-t border-white/5 bg-slate-950">
          <div className="flex items-center space-x-4 mb-8 p-3 bg-white/5 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center font-bold text-lg border-2 border-white/10 shadow-lg">NC</div>
            <div>
              <p className="text-sm font-bold truncate text-white">{user.username}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Admin Access</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 bg-white/5 text-slate-400 p-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-300 text-xs font-bold border border-white/5"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="ml-72 flex-grow p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/post/:id" element={<PublicLayout><ArticleDetail /></PublicLayout>} />
        <Route path="/adminlogin" element={<Login />} />
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/posts" element={<AdminLayout><AdminPosts /></AdminLayout>} />
        <Route path="/admin/comments" element={<AdminLayout><AdminComments /></AdminLayout>} />
        <Route path="/login" element={<Navigate to="/adminlogin" replace />} />
      </Routes>
    </Router>
  );
};

export default App;