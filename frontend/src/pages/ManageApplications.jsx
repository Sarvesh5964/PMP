import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ManageApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/applications');
      if (res.data.success) setApps(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, status) => {
    try {
      const res = await api.put(`/api/admin/applications/${id}`, { status });
      if (res.data.success) fetchApps();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="flex h-64 w-full items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div></div>;

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <h1 className="text-2xl font-bold font-display text-slate-100">Audit Applications</h1>
      <div className="overflow-x-auto rounded-2xl glass-panel border border-white/5">
        <table className="min-w-full divide-y divide-white/5 text-left text-xs">
          <thead className="bg-slate-900/40 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Company & Role</th>
              <th className="px-5 py-3">CTC Package</th>
              <th className="px-5 py-3">Pipeline Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {apps.map(app => (
              <tr key={app._id} className="hover:bg-white/5 transition-colors">
                <td className="px-5 py-3 font-semibold text-slate-200">{app.student?.name}</td>
                <td className="px-5 py-3 text-slate-400">{app.drive?.companyName} • {app.drive?.jobRole}</td>
                <td className="px-5 py-3 font-semibold">{app.drive?.package} LPA</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    app.status === 'selected' ? 'bg-emerald-500/10 text-emerald-400' :
                    app.status === 'shortlisted' ? 'bg-purple-500/10 text-purple-400' :
                    app.status === 'rejected' ? 'bg-rose-500/10 text-rose-400' : 'bg-white/5 text-slate-400'
                  }`}>{app.status}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <select value={app.status} onChange={e => handleUpdate(app._id, e.target.value)} className="rounded border border-white/10 bg-slate-950 text-[10px] text-slate-300 focus:outline-none">
                    <option value="applied">Applied</option>
                    <option value="shortlisted">Shortlist</option>
                    <option value="selected">Select</option>
                    <option value="rejected">Reject</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageApplications;
