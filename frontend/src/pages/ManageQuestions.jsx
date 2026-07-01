import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('aptitude');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [content, setContent] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);
  const [showAdd, setShowAdd] = useState(false);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = { title, type, category, difficulty, content };
    if (type === 'aptitude') {
      payload.options = options;
      payload.correctOption = parseInt(correctOption);
    } else if (type === 'coding') {
      payload.testCases = testCases;
    }
    try {
      const res = await api.post('/api/admin/questions', payload);
      if (res.data.success) {
        setShowAdd(false);
        setTitle(''); setCategory(''); setContent(''); setOptions(['', '', '', '']); setCorrectOption(0); setTestCases([{ input: '', expectedOutput: '' }]);
        fetchQuestions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete question?')) return;
    try {
      const res = await api.delete(`/api/admin/questions/${id}`);
      if (res.data.success) fetchQuestions();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-bold font-display text-slate-100">Manage Question Bank</h1><button onClick={() => setShowAdd(!showAdd)} className="py-2 px-3 bg-indigo-600 text-xs font-semibold text-white rounded-xl">{showAdd ? 'View Bank' : 'Add Question'}</button></div>
      {showAdd ? (
        <form onSubmit={handleCreate} className="max-w-xl mx-auto glass-panel p-6 rounded-2xl space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <select value={type} onChange={e => setType(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-slate-100 focus:outline-none">
              <option value="aptitude">Aptitude</option>
              <option value="coding">Coding</option>
              <option value="interview">Interview</option>
            </select>
            <input type="text" required placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-slate-100 focus:outline-none" />
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-slate-100 focus:outline-none">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <input type="text" required placeholder="Question Title" value={title} onChange={e => setTitle(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 px-3 text-slate-100 focus:outline-none" />
          <textarea required placeholder="Content text" value={content} onChange={e => setContent(e.target.value)} rows={3} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 px-3 text-slate-100 focus:outline-none" />

          {type === 'aptitude' && (
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-bold block">Options</span>
              <div className="grid grid-cols-2 gap-2">
                {options.map((opt, i) => (
                  <input key={i} type="text" required placeholder={`Option ${i+1}`} value={opt} onChange={e => { const copy = [...options]; copy[i] = e.target.value; setOptions(copy); }} className="block w-full rounded-xl border border-white/10 bg-slate-950 py-2 px-3 text-slate-100 focus:outline-none" />
                ))}
              </div>
              <select value={correctOption} onChange={e => setCorrectOption(e.target.value)} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-slate-100 focus:outline-none text-[10px] mt-2">
                <option value={0}>Option 1</option>
                <option value={1}>Option 2</option>
                <option value={2}>Option 3</option>
                <option value={3}>Option 4</option>
              </select>
            </div>
          )}

          {type === 'coding' && (
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-bold block">Test Case Parameters</span>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" required placeholder="Input Parameters" value={testCases[0].input} onChange={e => { const copy = [...testCases]; copy[0].input = e.target.value; setTestCases(copy); }} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-slate-100 focus:outline-none" />
                <input type="text" required placeholder="Expected Return" value={testCases[0].expectedOutput} onChange={e => { const copy = [...testCases]; copy[0].expectedOutput = e.target.value; setTestCases(copy); }} className="block w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-slate-100 focus:outline-none" />
              </div>
            </div>
          )}

          <button type="submit" className="w-full py-2.5 bg-indigo-600 text-xs font-semibold text-white rounded-xl">Publish Question</button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {questions.map(q => (
            <div key={q._id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">{q.title}</h3>
                    <span className="text-[9px] text-slate-500 font-bold uppercase">{q.type} • {q.category}</span>
                  </div>
                  <button onClick={() => handleDelete(q._id)} className="text-rose-500 text-[10px]">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;
