import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

const PracticePage = () => {
  const [questions, setQuestions] = useState([]);
  const [tab, setTab] = useState('coding');
  const [selectedQ, setSelectedQ] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [solving, setSolving] = useState(false);
  const [results, setResults] = useState(null);

  const [quizActive, setQuizActive] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState({});
  const [quizRes, setQuizRes] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/api/practice/questions');
      if (res.data.success) setQuestions(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartCoding = (q) => {
    setSelectedQ(q);
    setResults(null);
    setUserCode(q.title.toLowerCase().includes('reverse') ? `function reverseString(str) {\n  return str.split('').reverse().join('');\n}` : `function solve() {\n  // Code here\n}`);
  };

  const handleRunCode = async () => {
    setSolving(true);
    try {
      const res = await api.post(`/api/practice/coding/${selectedQ._id}`, { code: userCode });
      if (res.data.success) setResults(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setSolving(false);
    }
  };

  const handleStartQuiz = () => {
    setSelectedOpt({});
    setQuizRes(null);
    setQuizActive(true);
  };

  const handleSubmitQuiz = async () => {
    const formatted = Object.entries(selectedOpt).map(([qId, idx]) => ({ questionId: qId, selectedOption: idx }));
    try {
      const res = await api.post('/api/practice/aptitude', { answers: formatted });
      if (res.data.success) {
        setQuizRes(res.data.data);
        setQuizActive(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const coding = questions.filter(q => q.type === 'coding');
  const aptitude = questions.filter(q => q.type === 'aptitude');

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <h1 className="text-2xl font-bold font-display text-slate-100">Practice Hub</h1>
      {!selectedQ && !quizActive && (
        <div className="flex gap-4 border-b border-white/5 pb-2">
          <button onClick={() => setTab('coding')} className={`pb-2 text-xs font-semibold focus:outline-none ${tab === 'coding' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500'}`}>Coding Challenges</button>
          <button onClick={() => setTab('aptitude')} className={`pb-2 text-xs font-semibold focus:outline-none ${tab === 'aptitude' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500'}`}>Aptitude Tests</button>
        </div>
      )}

      {selectedQ ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <button onClick={() => setSelectedQ(null)} className="text-[10px] text-slate-500">← Back</button>
            <h2 className="text-base font-bold text-slate-200">{selectedQ.title}</h2>
            <div className="p-4 bg-slate-900/60 border border-white/5 text-xs text-slate-400 font-mono leading-relaxed whitespace-pre-line rounded-xl">{selectedQ.content}</div>
          </div>
          <div className="space-y-4">
            <textarea value={userCode} onChange={e => setUserCode(e.target.value)} className="w-full h-64 bg-slate-950 p-4 border border-white/10 rounded-xl text-xs font-mono text-indigo-300 resize-none focus:outline-none" />
            <button onClick={handleRunCode} disabled={solving} className="w-full py-2.5 bg-indigo-600 text-xs font-semibold text-white rounded-xl hover:bg-indigo-500">{solving ? 'Evaluating...' : 'Run & Submit'}</button>
            {results && (
              <div className="glass-panel p-4 rounded-xl border border-white/5 text-xs">
                <span className="font-bold text-[10px] block mb-2 uppercase tracking-wide">Test cases</span>
                {results.results.map((r, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-white/5 last:border-0">
                    <span className="font-mono text-slate-400">Case {idx+1}: {r.passed ? 'Passed' : 'Failed'}</span>
                    {r.passed ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-rose-400" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : quizActive ? (
        <div className="space-y-6 max-w-xl mx-auto">
          {aptitude.map((q, i) => (
            <div key={q._id} className="glass-panel p-5 rounded-2xl space-y-3">
              <span className="text-[10px] text-slate-500 block font-bold">QUESTION {i+1}</span>
              <p className="text-xs text-slate-300">{q.content}</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {q.options?.map((opt, oIdx) => (
                  <button key={oIdx} onClick={() => setSelectedOpt({ ...selectedOpt, [q._id]: oIdx })} className={`text-left p-2 text-[10px] rounded-lg border focus:outline-none ${selectedOpt[q._id] === oIdx ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>{opt}</button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleSubmitQuiz} className="w-full py-3 bg-indigo-600 text-xs font-semibold text-white rounded-2xl hover:bg-indigo-500">Submit Quiz</button>
        </div>
      ) : (
        <div>
          {tab === 'coding' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coding.map(q => (
                <div key={q._id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold uppercase">{q.difficulty}</span>
                    <h3 className="text-sm font-bold text-slate-200 mt-2">{q.title}</h3>
                  </div>
                  <button onClick={() => handleStartCoding(q)} className="mt-4 py-2 bg-white/5 border border-white/5 text-slate-300 font-semibold text-[10px] rounded-xl hover:bg-white/10">Solve Challenge</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {quizRes && (
                <div className="glass-panel p-5 rounded-2xl space-y-2 text-xs">
                  <h3 className="font-bold text-slate-200 border-b border-white/5 pb-2">Quiz Summary</h3>
                  <p className="text-slate-400">Correct Answers: <span className="text-indigo-400 font-bold">{quizRes.score}/{quizRes.totalQuestions}</span></p>
                </div>
              )}
              <div className="glass-panel p-8 rounded-3xl text-center max-w-sm mx-auto space-y-4">
                <HelpCircle className="h-8 w-8 text-slate-500 mx-auto" />
                <span className="block text-xs text-slate-400">Launch a timed MCQ aptitude practice session.</span>
                <button onClick={handleStartQuiz} className="w-full py-2.5 bg-indigo-600 text-xs font-semibold text-white rounded-xl hover:bg-indigo-500">Start Timed Test</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticePage;
