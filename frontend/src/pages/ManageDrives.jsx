import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ManageDrives = () => {
  const [drives, setDrives] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [description, setDescription] = useState('');
  const [packageCTC, setPackageCTC] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await api.get('/api/profile/drives');
      if (res.data.success) setDrives(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const skills = requiredSkills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    try {
      const res = await api.post('/api/admin/drives', { companyName, jobRole, description, package: parseFloat(packageCTC), criteria: { minCgpa: parseFloat(minCgpa), requiredSkills: skills }, deadline: new Date(deadline) });
      if (res.data.success) {
        setShowAdd(false);
        setCompanyName(''); setJobRole(''); setDescription(''); setPackageCTC(''); setMinCgpa(''); setRequiredSkills(''); setDeadline('');
        fetchDrives();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete drive?')) return;
    try {
      const res = await api.delete(`/api/admin/drives/${id}`);
      if (res.data.success) fetchDrives();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-bold font-display text-slate-100">Manage Placement Campaigns</h1><button onClick={() => setShowAdd(!showAdd)} className="py-2 px-3 bg-indigo-600 text-xs font-semibold text-white rounded-xl">{showAdd ? 'View Drives' : 'Add Drive'}</button></div>
      {showAdd ? (
        <form onSubmit={handleCreate} className="max-w-xl mx-auto glass-panel p-6 rounded-2xl space-y-3 text-xs">
          <input type="text" required placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 px-3 text-slate-100 focus:outline-none" />
          <input type="text" required placeholder="Designation" value={jobRole} onChange={e => setJobRole(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 px-3 text-slate-100 focus:outline-none" />
          <textarea required placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 px-3 text-slate-100 focus:outline-none" />
          <div className="grid grid-cols-3 gap-2">
            <input type="number" required placeholder="Package (CTC)" value={packageCTC} onChange={e => setPackageCTC(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-slate-100 focus:outline-none" />
            <input type="number" step="0.01" required placeholder="Min CGPA" value={minCgpa} onChange={e => setMinCgpa(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-slate-100 focus:outline-none" />
            <input type="date" required value={deadline} onChange={e => setDeadline(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-slate-100 focus:outline-none" />
          </div>
          <input type="text" required placeholder="Skills (comma split)" value={requiredSkills} onChange={e => setRequiredSkills(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 px-3 text-slate-100 focus:outline-none" />
          <button type="submit" className="w-full py-2.5 bg-indigo-600 text-xs font-semibold text-white rounded-xl">Save Drive</button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drives.map(d => (
            <div key={d._id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div><h3 className="text-xs font-bold text-slate-200">{d.jobRole}</h3><p className="text-[9px] text-slate-500 font-bold">{d.companyName}</p></div>
                  <button onClick={() => handleDelete(d._id)} className="text-rose-500 hover:text-rose-400 text-[10px]">Delete</button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px] bg-white/5 p-3 rounded-xl">
                  <div><span className="text-slate-500 block">Package</span><span className="text-slate-200 font-bold">{d.package} LPA</span></div>
                  <div><span className="text-slate-500 block">Min CGPA</span><span className="text-slate-200 font-bold">{d.criteria.minCgpa}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageDrives;
