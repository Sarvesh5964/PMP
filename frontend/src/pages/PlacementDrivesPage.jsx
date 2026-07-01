import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PlacementDrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [recs, setRecs] = useState([]);
  const [apps, setApps] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    setLoading(true);
    try {
      const prof = await api.get('/api/profile');
      if (prof.data.success) setProfile(prof.data.data);

      const d = await api.get('/api/profile/drives');
      const r = await api.get('/api/profile/recommendations');
      const a = await api.get('/api/profile/applications');

      if (d.data.success) setDrives(d.data.data);
      if (r.data.success) setRecs(r.data.data);
      if (a.data.success) setApps(a.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId) => {
    setMsg('');
    setErr('');
    try {
      const res = await api.post(`/api/profile/drives/${driveId}/apply`);
      if (res.data.success) {
        setMsg('Successfully applied to drive campaign!');
        const resApps = await api.get('/api/profile/applications');
        if (resApps.data.success) setApps(resApps.data.data);
      }
    } catch (e) {
      setErr(e.response?.data?.message || 'Application failed.');
    }
  };

  const isEligible = (drive) => {
    if (!profile) return false;
    if (profile.cgpa < drive.criteria.minCgpa) return false;
    return true;
  };

  if (loading) return <div className="flex h-64 w-full items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div></div>;

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <h1 className="text-2xl font-bold font-display text-slate-100">Placement Campaigns</h1>
      {msg && <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">{msg}</div>}
      {err && <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">{err}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <span className="text-xs font-bold text-slate-300 block">Active Openings</span>
          {drives.map(drive => {
            const hasApplied = apps.some(a => a.drive?._id === drive._id);
            const appInfo = apps.find(a => a.drive?._id === drive._id);
            const eligible = isEligible(drive);
            const fitMatch = recs.find(r => r.companyName === drive.companyName)?.matchPercentage || 50;

            return (
              <div key={drive._id} className="glass-panel p-5 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-500/10 px-2.5 py-0.5 text-indigo-400 text-[9px] font-bold rounded-bl-xl border-l border-b border-white/5">{fitMatch}% AI Fit</div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">{drive.jobRole}</h3>
                  <span className="text-[10px] text-slate-500 font-bold">{drive.companyName}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed truncate">{drive.description}</p>
                <div className="grid grid-cols-2 gap-3 text-[10px] bg-white/5 p-3 rounded-xl">
                  <div><span className="text-slate-500 block">CTC PACKAGE</span><span className="text-slate-200 font-bold">{drive.package} LPA</span></div>
                  <div><span className="text-slate-500 block">MIN CGPA</span><span className="text-slate-200 font-bold">{drive.criteria.minCgpa}</span></div>
                </div>
                <div className="flex justify-between items-center pt-2 text-xs border-t border-white/5">
                  {hasApplied ? (
                    <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[9px]">Status: {appInfo.status}</span>
                  ) : (
                    <span className={`text-[9px] font-bold ${eligible ? 'text-indigo-400' : 'text-rose-400'}`}>{eligible ? 'Eligible to Apply' : 'Ineligible'}</span>
                  )}
                  {!hasApplied && <button onClick={() => handleApply(drive._id)} disabled={!eligible} className="py-1 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[10px] rounded-lg disabled:opacity-40">Apply</button>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <span className="text-xs font-bold text-slate-300 block">AI Match Suggestions</span>
          <div className="space-y-3">
            {recs.map((rec, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 text-[10px] space-y-1">
                <div className="flex justify-between items-center font-bold"><span>{rec.companyName}</span><span className="text-indigo-400">{rec.matchPercentage}% Fit</span></div>
                <p className="text-slate-400">{rec.matchReason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementDrivesPage;
