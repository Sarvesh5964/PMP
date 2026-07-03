import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { HelpCircle, CheckCircle2, XCircle, Code, Award, CheckSquare, Terminal } from 'lucide-react';

const templates = {
  javascript: `function solve() {\n  // Write JavaScript code here\n}`,
  python: `def solve():\n    # Write Python code here\n    pass`,
  python3: `def solve():\n    # Write Python 3 code here\n    pass`,
  c: `#include <stdio.h>\n\nvoid solve() {\n    // Write C code here\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nvoid solve() {\n    // Write C++ code here\n}`,
  java: `public class Solution {\n    public static void solve() {\n        // Write Java code here\n    }\n}`,
  csharp: `using System;\n\npublic class Solution {\n    public static void Solve() {\n        // Write C# code here\n    }\n}`,
  ruby: `def solve\n  # Write Ruby code here\nend`
};

const aptitudeSections = [
  { name: 'Quantitative Aptitude', desc: 'Practice train problems, work & efficiency, simple/compound interest, ratios, averages.' },
  { name: 'Logical Reasoning', desc: 'Practice blood relations, letter series, direction sense, clock angles, seating arrangements.' },
  { name: 'Verbal Ability', desc: 'Practice sentence correction, synonyms, antonyms, voice shifts, active grammar.' },
  { name: 'Data Interpretation', desc: 'Practice reading bar graphs, pie charts, stock line graphs, demographic tables.' },
  { name: 'Data Sufficiency', desc: 'Practice age comparisons, radius proofs, numeric properties, work estimation.' },
  { name: 'Analytical Reasoning', desc: 'Practice matrix arrangements, truth-teller riddles, scheduling calendars, input-output.' }
];

const PracticePage = () => {
  const location = useLocation();
  const isAptitudeRoute = location.pathname === '/aptitude';

  const [questions, setQuestions] = useState([]);
  const [selectedQ, setSelectedQ] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [solving, setSolving] = useState(false);
  const [results, setResults] = useState(null);

  const [quizActive, setQuizActive] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState({});
  const [quizRes, setQuizRes] = useState(null);
  const [selectedAptitudeCat, setSelectedAptitudeCat] = useState(null);

  // Category filter for coding
  const [selectedCategory, setSelectedCategory] = useState('All');

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
    setLanguage('javascript');
    setUserCode(templates.javascript);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setUserCode(templates[lang]);
  };

  const handleExecuteCode = async (runOnly = false) => {
    setSolving(true);
    try {
      const res = await api.post(`/api/practice/coding/${selectedQ._id}`, { 
        code: userCode, 
        language, 
        runOnly 
      });
      if (res.data.success) {
        setResults(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSolving(false);
    }
  };

  const handleStartQuiz = (categoryName) => {
    setSelectedAptitudeCat(categoryName);
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

  const filteredAptitude = selectedAptitudeCat
    ? aptitude.filter(q => q.category === selectedAptitudeCat)
    : aptitude;

  const categories = ['All', 'Arrays', 'Strings', 'Linked List', 'Stacks and Queues', 'Trees and Graphs', 'Recursion'];
  const filteredCoding = selectedCategory === 'All' ? coding : coding.filter(q => q.category === selectedCategory);

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display text-slate-100 flex items-center gap-2">
          {isAptitudeRoute ? (
            <>
              <CheckSquare className="h-6 w-6 text-indigo-400" />
              Aptitude Assessments
            </>
          ) : (
            <>
              <Code className="h-6 w-6 text-purple-400" />
              Coding Practice Challenges
            </>
          )}
        </h1>
      </div>

      {isAptitudeRoute ? (
        // Aptitude Route
        quizActive ? (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl border border-white/5">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Topic: {selectedAptitudeCat}</span>
              <button onClick={() => setQuizActive(false)} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">← Exit Test</button>
            </div>
            {filteredAptitude.map((q, i) => (
              <div key={q._id} className="glass-panel p-5 rounded-2xl space-y-3">
                <span className="text-[10px] text-slate-500 block font-bold">QUESTION {i+1}</span>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">{q.content}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {q.options?.map((opt, oIdx) => (
                    <button key={oIdx} onClick={() => setSelectedOpt({ ...selectedOpt, [q._id]: oIdx })} className={`text-left p-2.5 text-[10px] rounded-xl border focus:outline-none transition-all ${selectedOpt[q._id] === oIdx ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold' : 'bg-slate-900/60 border-white/5 text-slate-400 hover:bg-white/10'}`}>{opt}</button>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={handleSubmitQuiz} className="w-full py-3 bg-indigo-600 text-xs font-semibold text-white rounded-2xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/10">Submit Quiz</button>
          </div>
        ) : (
          <div className="space-y-6">
            {quizRes && (
              <div className="glass-panel p-5 rounded-2xl max-w-md mx-auto space-y-2 text-xs border border-white/5">
                <h3 className="font-bold text-slate-200 border-b border-white/5 pb-2 flex items-center gap-2">
                  <Award className="h-4 w-4 text-indigo-400" />
                  Test Results Summary: {selectedAptitudeCat}
                </h3>
                <p className="text-slate-400">Score: <span className="text-indigo-400 font-bold">{quizRes.score} / {quizRes.totalQuestions}</span></p>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-1">Accuracy registered to your Career Readiness index.</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aptitudeSections.map((sec, idx) => {
                const count = aptitude.filter(q => q.category === sec.name).length;
                return (
                  <div key={idx} className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-slate-200 font-display">{sec.name}</h3>
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold">{count || 12} Questions</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{sec.desc}</p>
                    </div>
                    <button onClick={() => handleStartQuiz(sec.name)} className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[10px] rounded-xl transition-colors shadow-sm shadow-indigo-600/10">
                      Start Prep Test
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        // Coding Route
        selectedQ ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-5 rounded-2xl space-y-4">
              <button onClick={() => setSelectedQ(null)} className="text-[10px] text-slate-500">← Back to challenges list</button>
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-200">{selectedQ.title}</h2>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                  selectedQ.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400' :
                  selectedQ.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                }`}>{selectedQ.difficulty}</span>
              </div>
              <div className="p-4 bg-slate-900/60 border border-white/5 text-xs text-slate-400 font-mono leading-relaxed whitespace-pre-line rounded-xl">{selectedQ.content}</div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">HINTS / DISCUSSIONS</span>
                <ul className="text-[10px] text-slate-500 list-disc list-inside">
                  {selectedQ.hints?.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Language Selection Header */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Terminal className="h-4.5 w-4.5 text-indigo-400" />
                  Code Workspace Editor
                </span>
                <select value={language} onChange={e => handleLanguageChange(e.target.value)} className="rounded-lg border border-white/10 bg-slate-900 py-1.5 px-3.5 text-slate-200 text-xs focus:outline-none">
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="python3">Python 3</option>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="ruby">Ruby</option>
                </select>
              </div>

              <textarea value={userCode} onChange={e => setUserCode(e.target.value)} className="w-full h-80 bg-slate-950 p-4 border border-white/10 rounded-xl text-xs font-mono text-indigo-300 resize-none focus:outline-none" />
              
              {/* Execution Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleExecuteCode(true)} disabled={solving} className="py-2.5 bg-white/5 border border-white/5 text-xs font-semibold text-slate-300 rounded-xl hover:bg-white/10 transition-colors">
                  {solving ? 'Running...' : 'Compile & Run'}
                </button>
                <button onClick={() => handleExecuteCode(false)} disabled={solving} className="py-2.5 bg-indigo-600 text-xs font-semibold text-white rounded-xl hover:bg-indigo-500 transition-colors">
                  {solving ? 'Submitting...' : 'Submit Solution'}
                </button>
              </div>

              {/* Execution Results Terminal Panel */}
              {results && (
                <div className="glass-panel p-4 rounded-xl border border-white/5 text-xs space-y-3">
                  <span className="font-bold text-[10px] block uppercase tracking-wide text-slate-400">Terminal Output Logs</span>
                  
                  {results.compilerError ? (
                    /* Red IDE compiler warning */
                    <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/5 text-[11px] font-mono text-rose-400 whitespace-pre-wrap leading-relaxed">
                      <span className="font-extrabold uppercase text-[9px] text-rose-500 block mb-1">COMPILATION ERROR</span>
                      {results.compilerError}
                    </div>
                  ) : (
                    /* Test Cases details */
                    <div className="space-y-3">
                      {results.results.map((r, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                          <div className="flex justify-between items-center border-b border-white/5 pb-1">
                            <span className="font-bold text-[9px] text-slate-500">TEST CASE {idx + 1}</span>
                            {r.passed ? (
                              <span className="text-[9px] text-emerald-400 font-extrabold uppercase flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Passed
                              </span>
                            ) : (
                              <span className="text-[9px] text-rose-400 font-extrabold uppercase flex items-center gap-1">
                                <XCircle className="h-3.5 w-3.5" /> Failed
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono leading-relaxed">
                            <div>
                              <span className="text-slate-500 block text-[9px]">Input</span>
                              <span className="text-slate-400">{r.input}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px]">Expected</span>
                              <span className="text-indigo-400">{r.expected}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px]">Actual</span>
                              <span className={r.passed ? 'text-emerald-400' : 'text-rose-400'}>{r.actual}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 pb-2">
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold border focus:outline-none transition-all ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>{cat}</button>
              ))}
            </div>
            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCoding.map(q => (
                <div key={q._id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        q.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400' :
                        q.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>{q.difficulty}</span>
                      <span className="text-[8px] font-bold uppercase text-slate-500">{q.category}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-200 mt-2">{q.title}</h3>
                  </div>
                  <button onClick={() => handleStartCoding(q)} className="mt-4 py-2 bg-white/5 border border-white/5 text-slate-300 font-semibold text-[10px] rounded-xl hover:bg-white/10">Solve Challenge</button>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PracticePage;
