import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Upload, Award, FileText, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

const ResumePage = () => {
  const [profile, setProfile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/profile');
      if (res.data.success) {
        setProfile(res.data.data);
      }
    } catch (e) {
      console.error(e);
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
        setMsg('Resume analyzed successfully!');
      }
    } catch (e) {
      setErr('Failed to parse and upload file.');
    } finally {
      setUploading(false);
    }
  };

  if (!profile) return <div className="flex h-64 w-full items-center justify-center bg-slate-950"><div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div></div>;

  const analysis = profile.resumeAnalysis || {};

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <h1 className="text-2xl font-bold font-display text-slate-100 flex items-center gap-2">
        <FileText className="h-6 w-6 text-indigo-400" />
        Resume Optimizer (ATS)
      </h1>
      
      {msg && <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">{msg}</div>}
      {err && <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">{err}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Panel */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-200 font-display">Upload Document</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed">Submit your PDF resume to run our automated parser and generate your corporate ATS compatibility scorecard.</p>
          
          <div className="border border-dashed border-white/10 rounded-2xl p-6 text-center cursor-pointer relative hover:border-indigo-500/25 transition-colors">
            <input type="file" accept=".pdf" onChange={e => setResumeFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <Upload className="h-7 w-7 text-slate-500 mx-auto" />
            <p className="text-[10px] text-slate-400 mt-2 font-semibold truncate px-2">{resumeFile ? resumeFile.name : 'Select PDF Resume'}</p>
          </div>
          <button onClick={handleUpload} disabled={!resumeFile || uploading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-xl disabled:opacity-40 transition-colors shadow-lg shadow-indigo-600/10">
            {uploading ? 'Analyzing Resume...' : 'Parse & Scan ATS'}
          </button>
        </div>

        {/* ATS Evaluation Report Panel */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-5">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-purple-400" />
              Interactive ATS Scorecard
            </span>
          </div>

          {analysis.score ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center text-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">ATS Compatibility Score</span>
                <h3 className={`text-4xl font-extrabold mt-2 ${analysis.score >= 80 ? 'text-emerald-400' : analysis.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>{analysis.score}%</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 space-y-2">
                  <span className="text-[10px] text-emerald-400 block font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Detected Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {analysis.detectedSkills?.map((s, i) => (
                      <span key={i} className="text-[9px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded font-mono font-semibold">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 space-y-2">
                  <span className="text-[10px] text-amber-400 block font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Missing Keywords
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {analysis.missingSkills?.map((s, i) => (
                      <span key={i} className="text-[9px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded font-mono font-semibold">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 space-y-2">
                <span className="text-[10px] text-indigo-400 block font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4" /> Recruiter Optimization Tips
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed list-disc list-inside">
                  {analysis.suggestions?.map((s, idx) => <li key={idx}>{s}</li>)}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex h-56 items-center justify-center flex-col gap-2 text-slate-600 text-center">
              <FileText className="h-8 w-8 text-slate-500 mx-auto" />
              <span className="text-[10px] uppercase font-bold tracking-wider leading-relaxed">No evaluation report compiled.<br/>Upload your resume PDF to begin scanning.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
