import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Upload } from 'lucide-react';

const ResumePage = () => {
  const [profile, setProfile] = useState(null);
  const [cgpa, setCgpa] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState('');
  const [internships, setInternships] = useState('');
  const [certificates, setCertificates] = useState('');

  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('profile');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/profile');
      if (res.data.success) {
        setProfile(res.data.data);
        setCgpa(res.data.data.cgpa || '');
        setSkills(res.data.data.skills?.join(', ') || '');
        setEducation(res.data.data.education || []);
        setProjects(res.data.data.projects || '');
        setInternships(res.data.data.internships || '');
        setCertificates(res.data.data.certificates || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    const skillList = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    try {
      const res = await api.put('/api/profile', { cgpa: parseFloat(cgpa) || 0, skills: skillList, education, projects, internships, certificates });
      if (res.data.success) {
        setProfile(res.data.data);
        setMsg('Profile details updated!');
      }
    } catch (e) {
      setErr('Failed to update profile info.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    setUploading(true);
    setMsg('');
    setErr('');
    const fd = new FormData();
    fd.append('resume', resumeFile);
    try {
      const res = await api.post('/api/profile/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success) {
        setProfile(prev => ({ ...prev, resumeUrl: res.data.data.resumeUrl, resumeAnalysis: res.data.data.resumeAnalysis }));
        setMsg('Resume analyzed and updated!');
        setTab('analysis');
      }
    } catch (e) {
      setErr('Failed to parse and upload file.');
    } finally {
      setUploading(false);
    }
  };

  if (!profile) return <div className="flex h-64 w-full items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div></div>;

  const analysis = profile.resumeAnalysis || {};

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <h1 className="text-2xl font-bold font-display text-slate-100">Resume & Profile</h1>
      <div className="flex gap-4 border-b border-white/5 pb-2">
        <button onClick={() => setTab('profile')} className={`pb-2 text-xs font-semibold focus:outline-none ${tab === 'profile' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500'}`}>Edit Profile</button>
        <button onClick={() => setTab('analysis')} className={`pb-2 text-xs font-semibold focus:outline-none ${tab === 'analysis' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500'}`}>ATS Report</button>
      </div>
      {msg && <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">{msg}</div>}
      {err && <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">{err}</div>}

      {tab === 'profile' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleUpdate} className="lg:col-span-2 space-y-4">
            <div className="glass-panel p-5 rounded-2xl grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1 font-bold">CGPA</label>
                <input type="number" step="0.01" value={cgpa} onChange={e => setCgpa(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-slate-100 text-xs focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1 font-bold">SKILLS (comma split)</label>
                <input type="text" value={skills} onChange={e => setSkills(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-slate-100 text-xs focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] text-slate-500 mb-1 font-bold">PROJECTS</label>
                <input type="text" placeholder="e.g. Chat App using React, Portfolio website" value={projects} onChange={e => setProjects(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-slate-100 text-xs focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1 font-bold">INTERNSHIPS</label>
                <input type="text" placeholder="e.g. Web Dev Intern at Google" value={internships} onChange={e => setInternships(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-slate-100 text-xs focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1 font-bold">CERTIFICATES</label>
                <input type="text" placeholder="e.g. AWS Cloud Practitioner" value={certificates} onChange={e => setCertificates(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-slate-100 text-xs focus:outline-none" />
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 text-xs font-semibold text-white rounded-2xl hover:bg-indigo-500">Save Profile</button>
          </form>
          <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col">
            <span className="text-xs font-bold text-slate-300">Upload PDF Resume</span>
            <div className="border border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer relative hover:border-indigo-500/20">
              <input type="file" accept=".pdf" onChange={e => setResumeFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className="h-6 w-6 text-slate-500 mx-auto" />
              <p className="text-[10px] text-slate-400 mt-2 font-bold">{resumeFile ? resumeFile.name : 'Select PDF File'}</p>
            </div>
            <button onClick={handleUpload} disabled={!resumeFile || uploading} className="w-full py-2.5 bg-indigo-600 text-xs font-semibold text-white rounded-xl disabled:opacity-40">{uploading ? 'Analyzing...' : 'Parse Resume'}</button>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-3xl">
          {analysis.score ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">ATS SCORE</span>
                <h3 className="text-4xl font-extrabold text-indigo-400 mt-2">{analysis.score}</h3>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5"><span className="text-[10px] text-emerald-400 block font-bold mb-2">FOUND SKILLS</span><p className="text-xs text-slate-400 leading-relaxed">{analysis.detectedSkills?.join(', ')}</p></div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5"><span className="text-[10px] text-rose-400 block font-bold mb-2">MISSING CORE</span><p className="text-xs text-slate-400 leading-relaxed">{analysis.missingSkills?.join(', ')}</p></div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Recruiter Tips</span>
                  <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside leading-relaxed">
                    {analysis.suggestions?.map((s, idx) => <li key={idx}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ) : <p className="text-xs text-slate-500 text-center py-6">Please upload a resume first to compile reports.</p>}
        </div>
      )}
    </div>
  );
};

export default ResumePage;
