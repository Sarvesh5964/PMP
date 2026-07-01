import React, { useState } from 'react';
import api from '../services/api';
import { Sparkles } from 'lucide-react';

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
          { speaker: 'bot', text: `Hi! Let's begin your mock interview for the ${role} position. Answer as detailed as possible.` },
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
        setChatLog(prev => [...prev, { speaker: 'bot', text: 'Thank you! Press the evaluate button below to compile grading report details.' }]);
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
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <h1 className="text-2xl font-bold font-display text-slate-100">AI Mock Interview Coach</h1>
      {loading && <div className="flex h-32 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div></div>}

      {!started && !report && !loading && (
        <div className="max-w-md mx-auto glass-panel p-6 rounded-2xl space-y-4 text-center">
          <Sparkles className="h-8 w-8 text-indigo-400 mx-auto glow-animation" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Configure Role Mock</h3>
          <select value={role} onChange={e => setRole(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-slate-100 text-xs focus:outline-none">
            <option value="">-- Choose Role --</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Engineer">Backend Engineer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
          </select>
          <button onClick={startSession} className="w-full py-2.5 bg-indigo-600 text-xs font-semibold text-white rounded-xl hover:bg-indigo-500">Start Session</button>
        </div>
      )}

      {started && !loading && (
        <div className="max-w-2xl mx-auto flex flex-col h-[450px] glass-panel rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 bg-slate-900/40 text-xs font-bold text-slate-400">{role} Interview</div>
          <div className="flex-1 p-5 overflow-y-auto space-y-3">
            {chatLog.map((chat, i) => (
              <div key={i} className={`flex gap-2 max-w-[80%] ${chat.speaker === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${chat.speaker === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'}`}>{chat.text}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/5 bg-slate-900/40 flex gap-2">
            {transcript.length < questions.length ? (
              <>
                <input type="text" value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSend(); }} placeholder="Type your answer..." className="flex-1 rounded-xl border border-white/10 bg-slate-950 py-2 px-3 text-xs text-slate-100 focus:outline-none" />
                <button onClick={handleSend} className="px-3 bg-indigo-600 text-white rounded-xl text-xs">Send</button>
              </>
            ) : <button onClick={handleEvaluate} className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-bold text-white rounded-xl">Compile Interview Grades</button>}
          </div>
        </div>
      )}

      {report && !loading && (
        <div className="max-w-xl mx-auto glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-xs font-bold text-slate-300">Grade Score</span>
            <span className="text-xl font-bold text-indigo-400">{report.score}%</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5"><span className="text-[10px] text-emerald-400 block font-bold mb-1">STRENGTHS</span><ul className="space-y-1 text-slate-400">{report.feedback.strengths.slice(0, 3).map((st, i) => <li key={i}>• {st}</li>)}</ul></div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5"><span className="text-[10px] text-rose-400 block font-bold mb-1">WEAKNESSES</span><ul className="space-y-1 text-slate-400">{report.feedback.weaknesses.slice(0, 3).map((wk, i) => <li key={i}>• {wk}</li>)}</ul></div>
          </div>
          <button onClick={() => setReport(null)} className="w-full py-2 bg-white/5 text-xs text-slate-400 rounded-xl">Practice Again</button>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
