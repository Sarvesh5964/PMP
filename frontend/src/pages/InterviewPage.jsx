import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Sparkles, Mic, MicOff, Send, MessageSquareCode, Award, CheckCircle, Flame, Clock, RefreshCw } from 'lucide-react';

const InterviewPage = () => {
  const [role, setRole] = useState('');
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const [chatLog, setChatLog] = useState([]);
  const [transcript, setTranscript] = useState([]);
  const [report, setReport] = useState(null);

  // Advanced Visuals
  const [isMicOn, setIsMicOn] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [history, setHistory] = useState([]);

  // Fetch history stats on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // Timer logic during active interview
  useEffect(() => {
    let timer;
    if (started) {
      timer = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(timer);
  }, [started, idx]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/api/practice/dashboard');
      if (res.data.success) {
        setHistory(res.data.data.mockInterviews || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startSession = async (e) => {
    e.preventDefault();
    if (!role) return;
    setLoading(true);
    setReport(null);
    setChatLog([]);
    setTranscript([]);

    try {
      const res = await api.post('/api/interview/start', { role });
      if (res.data.success) {
        const qList = res.data.data.questions;
        setQuestions(qList);
        setStarted(true);
        setIdx(0);
        setChatLog([
          { speaker: 'bot', text: `Welcome to your AI Mock Interview for the ${role} position. I will guide you through core technical and behavioral scenarios. Take your time, focus on flow, and submit detailed responses.` },
          { speaker: 'bot', text: qList[0].content }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!answer.trim()) return;
    const currentQ = questions[idx];
    setChatLog(prev => [...prev, { speaker: 'user', text: answer }]);
    setTranscript(prev => [...prev, { question: currentQ.content, answer, category: currentQ.category }]);
    setAnswer('');

    const next = idx + 1;
    if (next < questions.length) {
      setIdx(next);
      setTimeout(() => {
        setChatLog(prev => [...prev, { speaker: 'bot', text: questions[next].content }]);
      }, 700);
    } else {
      setTimeout(() => {
        setChatLog(prev => [...prev, { speaker: 'bot', text: 'Excellent job. All interview stages are complete. Click the compilation button below to generate your final AI feedback report.' }]);
      }, 700);
    }
  };

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/interview/submit', { role, transcript });
      if (res.data.success) {
        setReport(res.data.data);
        setStarted(false);
        fetchHistory();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* CSS Equalizer animation stylesheet */}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1.3); }
        }
        .bar-anim-1 { animation: wave 0.8s ease-in-out infinite alternate; }
        .bar-anim-2 { animation: wave 1.1s ease-in-out infinite alternate 0.2s; }
        .bar-anim-3 { animation: wave 0.7s ease-in-out infinite alternate 0.4s; }
        .bar-anim-4 { animation: wave 1.2s ease-in-out infinite alternate 0.1s; }
        .bar-anim-5 { animation: wave 0.9s ease-in-out infinite alternate 0.3s; }
      `}</style>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display text-slate-100 flex items-center gap-2">
          <MessageSquareCode className="h-6 w-6 text-indigo-400" />
          AI Mock Interview Coach
        </h1>
        {started && (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-3.5 py-1.5 rounded-full border border-white/5">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
            LIVE REC • {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex h-64 items-center justify-center flex-col gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI Recruiter Analysing...</span>
        </div>
      )}

      {/* Start Setup View & User Statistics History */}
      {!started && !report && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main config card */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 flex flex-col justify-between hover:border-white/10 transition-all">
            <div className="space-y-3">
              <Sparkles className="h-8 w-8 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-200 font-display">Configure Interview Room</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">Choose your target technology category to begin a realistic interview session. The recruiter will generate technical queries and analyze your response structure.</p>
            </div>
            <form onSubmit={startSession} className="space-y-3">
              <select value={role} onChange={e => setRole(e.target.value)} required className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 px-3 text-slate-100 text-xs focus:outline-none">
                <option value="">-- Target Role --</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
              </select>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-xs font-semibold text-white rounded-xl hover:bg-indigo-500">Enter Interview Room</button>
            </form>
          </div>

          {/* Previous Performance Logs */}
          <div className="glass-panel p-6 rounded-3xl lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-purple-400" />
                Your Performance History
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{history.length} attempts</span>
            </div>
            {history.length > 0 ? (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {history.map((h, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{h.role}</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">{new Date(h.date || Date.now()).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-extrabold ${h.score >= 80 ? 'text-emerald-400' : h.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>{h.score}%</span>
                      <span className="text-[9px] font-bold bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5 text-slate-400 uppercase">{h.score >= 70 ? 'PASS' : 'REVIEW'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-36 items-center justify-center flex-col gap-2 text-slate-600 text-center">
                <Flame className="h-6 w-6 text-slate-500 mx-auto" />
                <span className="text-[10px] uppercase font-bold tracking-wider">No mock session history</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Room View */}
      {started && !loading && (
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row h-[480px] glass-panel rounded-3xl overflow-hidden border border-white/5">
          {/* Recruiter Avatar Panel */}
          <div className="w-full md:w-56 bg-slate-900/40 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-white/5">
            <div className="text-center space-y-4">
              <div className="relative h-20 w-20 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-display font-extrabold text-white text-3xl shadow-xl shadow-indigo-500/10">
                AI
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-slate-900 bg-emerald-500"></span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">AI Coach (Ava)</h4>
                <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-wider">Interviewer</p>
              </div>
            </div>

            {/* Mic wave Equalizer */}
            {isMicOn ? (
              <div className="flex items-end justify-center gap-1 h-8 w-24">
                <div className="w-1.5 h-6 bg-indigo-500 rounded-full origin-bottom bar-anim-1"></div>
                <div className="w-1.5 h-6 bg-purple-500 rounded-full origin-bottom bar-anim-2"></div>
                <div className="w-1.5 h-6 bg-pink-500 rounded-full origin-bottom bar-anim-3"></div>
                <div className="w-1.5 h-6 bg-indigo-400 rounded-full origin-bottom bar-anim-4"></div>
                <div className="w-1.5 h-6 bg-purple-400 rounded-full origin-bottom bar-anim-5"></div>
              </div>
            ) : (
              <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1">
                <MicOff className="h-3 w-3" />
                Text Mode
              </div>
            )}

            <button onClick={() => setIsMicOn(!isMicOn)} className={`flex items-center justify-center p-3 rounded-full border transition-all ${isMicOn ? 'bg-rose-500/10 border-rose-500 text-rose-400' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>
              {isMicOn ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>

          {/* Active Chat Thread */}
          <div className="flex-1 flex flex-col h-full bg-slate-950/20">
            {/* Progress Step Header */}
            <div className="px-5 py-3.5 border-b border-white/5 bg-slate-900/40 flex justify-between items-center text-[10px] font-bold text-slate-400 tracking-wider">
              <span>INTERVIEW PROGRESS</span>
              <span className="text-indigo-400">{transcript.length} / {questions.length} STAGES</span>
            </div>

            {/* Conversational Bubble Logs */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {chatLog.map((chat, i) => (
                <div key={i} className={`flex gap-3 max-w-[85%] ${chat.speaker === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed ${chat.speaker === 'user' ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-tr-none shadow-md shadow-indigo-600/10' : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'}`}>{chat.text}</div>
                </div>
              ))}
            </div>

            {/* Text Editor Message inputs */}
            <div className="p-3 border-t border-white/5 bg-slate-900/40 flex gap-2">
              {transcript.length < questions.length ? (
                <>
                  <input type="text" value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSend(); }} placeholder={isMicOn ? "Recruiter listening... Speak or type response" : "Type your technical answer here..."} className="flex-1 rounded-xl border border-white/10 bg-slate-950 py-2.5 px-4 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none" />
                  <button onClick={handleSend} className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button onClick={handleEvaluate} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-bold text-white rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generate AI Feedback Report
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Feedback Evaluation Report Card */}
      {report && !loading && (
        <div className="max-w-2xl mx-auto glass-panel p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-200 font-display">Performance Score Card</h2>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{role} Mock</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-extrabold ${report.score >= 80 ? 'text-emerald-400' : report.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>{report.score}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Strengths */}
            <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 space-y-2">
              <span className="text-[10px] text-emerald-400 block font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                Key Strengths Detected
              </span>
              <ul className="space-y-1.5 text-slate-300 leading-relaxed">
                {report.feedback.strengths.slice(0, 3).map((st, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-emerald-500 select-none">•</span>
                    {st}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 space-y-2">
              <span className="text-[10px] text-rose-400 block font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Constructive Critiques
              </span>
              <ul className="space-y-1.5 text-slate-300 leading-relaxed">
                {report.feedback.weaknesses.slice(0, 3).map((wk, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-rose-500 select-none">•</span>
                    {wk}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button onClick={() => setReport(null)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 rounded-xl border border-white/5 transition-all">
            Initiate New Interview Session
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
