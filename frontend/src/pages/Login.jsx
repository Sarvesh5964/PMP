import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res?.success) navigate('/');
    else setError(res?.message || 'Login failed.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-slate-950 relative">
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none"></div>
      <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-display font-extrabold text-white text-2xl shadow-xl">P</div>
          <h2 className="mt-6 text-3xl font-extrabold font-display bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-2">Sign in to your placement prep suite</p>
        </div>
        {error && <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">{error}</div>}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input type="email" required placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="block w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3 px-4 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none" />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="block w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3 pl-4 pr-12 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none">
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 bg-indigo-600 rounded-2xl text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all">Sign In</button>
        </form>
        <p className="text-center text-xs text-slate-400">New to portal? <Link to="/register" className="text-indigo-400 hover:underline">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
