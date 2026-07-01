import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register(name, email, password, role);
    setLoading(false);
    if (res?.success) navigate('/');
    else setError(res?.message || 'Registration failed.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-slate-950 relative">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-display font-extrabold text-white text-2xl shadow-xl">P</div>
          <h2 className="mt-6 text-3xl font-extrabold font-display bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">Create Account</h2>
        </div>
        {error && <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">{error}</div>}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input type="text" required placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="block w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3 px-4 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none" />
          <input type="email" required placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="block w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3 px-4 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none" />
          <input type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="block w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3 px-4 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none" />
          <select value={role} onChange={e => setRole(e.target.value)} className="block w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3 px-4 text-slate-100 text-xs focus:outline-none">
            <option value="student">Student Candidate</option>
            <option value="admin">Portal Administrator</option>
          </select>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 bg-indigo-600 rounded-2xl text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all">Register</button>
        </form>
        <p className="text-center text-xs text-slate-400">Already registered? <Link to="/login" className="text-indigo-400 hover:underline">Sign In</Link></p>
      </div>
    </div>
  );
};

export default Register;
