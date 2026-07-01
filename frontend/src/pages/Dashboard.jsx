import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Doughnut, Bar, Radar } from 'react-chartjs-2';
import { Users, Briefcase, TrendingUp, UserCheck } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [profileData, setProfileData] = useState(null);
  const [practiceData, setPracticeData] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (isAdmin) {
          const res = await api.get('/api/admin/dashboard');
          if (res.data.success) setAdminStats(res.data.data);
        } else {
          const profRes = await api.get('/api/profile');
          const pracRes = await api.get('/api/practice/dashboard');
          if (profRes.data.success) setProfileData(profRes.data.data);
          if (pracRes.data.success) setPracticeData(pracRes.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [isAdmin]);

  if (loading) return <div className="flex h-64 w-full items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div></div>;

  if (isAdmin && adminStats) {
    const appData = {
      labels: ['Applied', 'Shortlist', 'Select', 'Reject'],
      datasets: [{
        data: [adminStats.applicationStatusCounts.applied, adminStats.applicationStatusCounts.shortlisted, adminStats.applicationStatusCounts.selected, adminStats.applicationStatusCounts.rejected],
        backgroundColor: ['rgba(99, 102, 241, 0.7)', 'rgba(168, 85, 247, 0.7)', 'rgba(34, 197, 94, 0.7)', 'rgba(239, 68, 68, 0.7)']
      }]
    };

    return (
      <div className="space-y-6 p-6 lg:p-8">
        <h1 className="text-2xl font-bold font-display text-slate-100">Recruitment Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Students', val: adminStats.totalStudents, icon: Users, color: 'text-indigo-400' },
            { label: 'Job Drives', val: adminStats.totalDrives, icon: Briefcase, color: 'text-purple-400' },
            { label: 'Avg Package', val: `${adminStats.avgPackage} LPA`, icon: TrendingUp, color: 'text-emerald-400' },
            { label: 'Selection Rate', val: `${adminStats.selectionRate}%`, icon: UserCheck, color: 'text-pink-400' }
          ].map((c, i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{c.label}</p>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">{c.val}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-white/5 ${c.color}`}><c.icon className="h-5 w-5" /></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl flex flex-col items-center">
            <span className="font-display font-semibold text-xs text-slate-400 self-start">Applications Funnel</span>
            <div className="h-48 w-48 mt-4"><Doughnut data={appData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
          </div>
          <div className="glass-panel p-6 rounded-3xl md:col-span-2 space-y-4">
            <span className="font-display font-semibold text-xs text-slate-400">System Standing Metrics</span>
            <div className="space-y-4 pt-2">
              {[
                { name: 'Average ATS Resume Score', val: adminStats.avgResumeScore, color: 'bg-indigo-500', max: '100' },
                { name: 'Candidate Selection Conversion', val: adminStats.selectionRate, color: 'bg-emerald-500', max: '100%' }
              ].map((m, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400"><span>{m.name}</span><span className="font-bold text-slate-200">{m.val}/{m.max}</span></div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden"><div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.val}%` }}></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student readiness scoring logic
  const resScore = profileData?.resumeAnalysis?.score || 0;
  const codingSolved = practiceData?.codingProgress?.filter(c => c.status === 'solved').length || 0;
  const aptAttempted = practiceData?.aptitudeProgress?.reduce((acc, curr) => acc + curr.totalAttempted, 0) || 0;
  const aptCorrect = practiceData?.aptitudeProgress?.reduce((acc, curr) => acc + curr.correctAnswers, 0) || 0;
  const aptAccuracy = aptAttempted > 0 ? Math.round((aptCorrect / aptAttempted) * 100) : 0;
  const interviewScore = practiceData?.mockInterviews?.length > 0 ? Math.round(practiceData.mockInterviews.reduce((acc, curr) => acc + curr.score, 0) / practiceData.mockInterviews.length) : 0;

  const readinessScore = Math.round((resScore * 0.35) + (Math.min(codingSolved * 25, 100) * 0.25) + (aptAccuracy * 0.2) + (interviewScore * 0.2));

  const codingChart = {
    labels: ['Strings', 'Arrays', 'Others'],
    datasets: [{
      label: 'Solved',
      data: [
        practiceData?.codingProgress?.filter(c => c.question?.category === 'Strings' && c.status === 'solved').length || 0,
        practiceData?.codingProgress?.filter(c => c.question?.category === 'Arrays' && c.status === 'solved').length || 0,
        practiceData?.codingProgress?.filter(c => c.question?.category !== 'Strings' && c.question?.category !== 'Arrays' && c.status === 'solved').length || 0
      ],
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderRadius: 6
    }]
  };

  const aptitudeChart = {
    labels: ['Quant', 'Logical', 'Verbal'],
    datasets: [{
      label: 'Accuracy %',
      data: [75, 60, aptAccuracy || 50],
      backgroundColor: 'rgba(168, 85, 247, 0.2)',
      borderColor: 'rgba(168, 85, 247, 0.8)',
      borderWidth: 1.5
    }]
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold font-display text-slate-100">Welcome, {user?.name}!</h1>
        <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/10 uppercase tracking-wide">Software Engineer Track</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center">
          <span className="font-display font-semibold text-xs text-slate-400 self-start">Readiness Index</span>
          <div className="relative h-40 w-40 my-6 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="none" />
              <circle cx="50" cy="50" r="42" stroke="#6366f1" strokeWidth="6" fill="none" strokeDasharray="263.8" strokeDashoffset={263.8 - (263.8 * readinessScore) / 100} strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-slate-100">{readinessScore}</span>
              <span className="text-[9px] font-semibold text-slate-500 tracking-wider">FITNESS INDEX</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 max-w-[200px]">Combined metric scoring based on active preparation tests.</p>
        </div>
        <div className="glass-panel p-6 rounded-3xl md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-44"><Bar data={codingChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
          <div className="h-44"><Radar data={aptitudeChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
