
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login: React.FC = () => {
  const [username, setUsername] = useState(''); // Using username as email for this flow
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;

      storageService.setAuth({
        username: user.email?.split('@')[0] || 'Admin User',
        role: user.email === 'netbiz0925@gmail.com' ? 'super-admin' : 'admin',
        isLoggedIn: true
      });
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 brand-font">The Nation's Eyes</h2>
          <p className="text-slate-500 mt-2 uppercase tracking-widest text-xs font-bold">Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 text-white p-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
