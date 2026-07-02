import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Doughnut, Bar, Radar } from 'react-chartjs-2';
import {
  Users, Briefcase, TrendingUp, UserCheck, BookOpen, CheckCircle, Clock, Award, ChevronRight, Sparkles
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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

  // Preparation Roadmap milestones
  const milestones = [
    { title: 'Resume Review', desc: 'Upload profile resume & get score feedback', done: resScore > 0 },
    { title: 'Algorithm Mastery', desc: 'Complete 3 coding practice problems', done: codingSolved >= 3 },
    { title: 'Quantitative Skills', desc: 'Attempt at least 1 aptitude review test', done: aptAttempted > 0 },
    { title: 'Interview Confidence', desc: 'Complete a conversational AI evaluation', done: practiceData?.mockInterviews?.length > 0 }
  ];

  // Daily preparation tasks
  const dailyTasks = [
    { text: `Optimize ATS Score (Target 75, Current: ${resScore})`, done: resScore >= 75 },
    { text: `Solve a coding algorithm problem (Solved: ${codingSolved})`, done: codingSolved >= 1 },
    { text: 'Complete your daily aptitude training module', done: aptAttempted > 0 },
    { text: 'Mock interview session for soft-skills assessment', done: practiceData?.mockInterviews?.length > 0 }
  ];

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold font-display text-slate-100">Welcome, {user?.name}!</h1>
        <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/10 uppercase tracking-wide">Software Engineer Track</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Ring */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center">
          <span className="font-display font-semibold text-xs text-slate-400 self-start">Readiness Index</span>
          <div className="relative h-40 w-40 my-6 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="none" />
              <circle cx="50" cy="50" r="42" stroke="#6366f1" strokeWidth="6" fill="none" strokeDasharray="263.8" strokeDashoffset={263.8 - (263.8 * readinessScore) / 100} strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-slate-100">{readinessScore}%</span>
              <span className="text-[9px] font-semibold text-slate-500 tracking-wider">FITNESS INDEX</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 max-w-[200px]">Combined metric scoring based on active preparation tests.</p>
        </div>
        {/* Charts */}
        <div className="glass-panel p-6 rounded-3xl lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-44"><Bar data={codingChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
          <div className="h-44"><Radar data={aptitudeChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
        </div>
      </div>

      {/* Roadmap & Daily Tasks Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Tasks */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400" />
              Daily Preparation Tasks
            </h2>
            <span className="text-[9px] font-bold text-slate-500 uppercase">Preparation Goals</span>
          </div>
          <div className="space-y-3">
            {dailyTasks.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <span className={`text-xs ${t.done ? 'text-slate-400 line-through' : 'text-slate-200'}`}>{t.text}</span>
                {t.done ? (
                  <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-white/20 flex-shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Career Preparation Roadmap */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-400" />
              Your Career Roadmap
            </h2>
            <span className="text-[9px] font-bold text-slate-500 uppercase">Milestones</span>
          </div>
          <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
            {milestones.map((m, idx) => (
              <div key={idx} className="flex gap-4 relative">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${m.done ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-white/10 text-slate-500'}`}>
                  {m.done ? <CheckCircle className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                </div>
                <div className="flex-1 pt-0.5">
                  <h3 className="text-xs font-bold text-slate-200">{m.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{m.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600 self-center" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
