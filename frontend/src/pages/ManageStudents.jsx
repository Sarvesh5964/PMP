import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/api/admin/students');
        if (res.data.success) setStudents(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="flex h-64 w-full items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div></div>;

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <h1 className="text-2xl font-bold font-display text-slate-100">Manage Students</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map(s => {
          const profile = s.profile || {};
          const practice = s.practice || {};
          const codingSolved = practice.codingProgress?.filter(cp => cp.status === 'solved').length || 0;

          return (
            <div key={s.user._id} className="glass-panel p-5 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">{s.user.name?.charAt(0).toUpperCase()}</div>
                  <div><h3 className="text-xs font-bold text-slate-200">{s.user.name}</h3><p className="text-[9px] text-slate-500">{s.user.email}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px] bg-white/5 p-3 rounded-xl">
                  <div><span className="text-slate-500 block">CGPA</span><span className="text-slate-200 font-bold">{profile.cgpa || '0.0'}</span></div>
                  <div><span className="text-slate-500 block">Resume Score</span><span className="text-slate-200 font-bold">{profile.resumeAnalysis?.score || 'N/A'}</span></div>
                </div>
                <div className="text-[10px] text-slate-400">Coding Solved: <span className="font-bold text-indigo-400">{codingSolved}</span></div>
              </div>
              {profile.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="w-full text-center py-2 bg-white/5 border border-white/5 text-[10px] text-slate-300 font-semibold rounded-lg hover:bg-white/10">View Resume</a>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageStudents;
