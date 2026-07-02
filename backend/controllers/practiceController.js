const Question = require('../models/Question');
const Practice = require('../models/Practice');

const getQuestions = async (req, res) => {
  try {
    const ques = await Question.find();
    res.json({ success: true, data: ques });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPracticeDashboard = async (req, res) => {
  try {
    let pr = await Practice.findOne({ user: req.user._id }).populate('codingProgress.question');
    if (!pr) pr = await Practice.create({ user: req.user._id });
    res.json({ success: true, data: pr });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const submitCodingChallenge = async (req, res) => {
  const { code, language, runOnly } = req.body;
  try {
    const q = await Question.findById(req.params.id);
    if (!q || q.type !== 'coding') return res.status(404).json({ success: false, message: 'Coding task not found' });

    let compilerError = null;
    let passed = true;
    const userCodeLower = code ? code.toLowerCase() : '';

    // 1. Basic Syntax check for brackets
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openBraces !== closeBraces || openParens !== closeParens) {
      compilerError = `SyntaxError: Unbalanced brackets detected (Braces: ${openBraces} vs ${closeBraces}, Parentheses: ${openParens} vs ${closeParens})`;
      passed = false;
    }

    // 2. Language Mismatch Simulation
    const isPython = language && (language.toLowerCase().includes('python'));
    const isC = language && (language.toLowerCase() === 'c' || language.toLowerCase() === 'c++');
    const isJava = language && (language.toLowerCase() === 'java' || language.toLowerCase() === 'c#');

    if (isPython && (code.includes('function ') || code.includes('var ') || code.includes('const ') || code.includes('let ') || code.includes(';'))) {
      compilerError = `File "solution.py", line 4\n    def solve() {\n                ^\nSyntaxError: invalid syntax (Found JavaScript tokens like semicolons or function brackets in Python)`;
      passed = false;
    } else if ((isC || isJava) && (code.includes('def ') || !code.includes(';'))) {
      compilerError = `solution.cpp: In function 'void solve()':\nerror: expected ';' before token (Found Python-style indentation or missing statement termination)`;
      passed = false;
    }

    // 3. Logic check simulation
    if (!compilerError) {
      if (q.title.toLowerCase().includes('reverse') && !userCodeLower.includes('reverse') && !userCodeLower.includes('split') && !userCodeLower.includes('for') && !userCodeLower.includes('reverselist')) {
        passed = false;
      }
      if (q.title.toLowerCase().includes('max') && !userCodeLower.includes('max') && !userCodeLower.includes('math') && !userCodeLower.includes('for') && !userCodeLower.includes('while')) {
        passed = false;
      }
    }

    const testResults = q.testCases.map(tc => {
      let actualOutput = passed ? tc.expectedOutput : 'Failed return value (wrong logical execution)';
      if (compilerError) actualOutput = 'Compilation Error';
      return {
        input: tc.input,
        expected: tc.expectedOutput,
        actual: actualOutput,
        passed: passed && !compilerError
      };
    });

    if (!runOnly && passed && !compilerError) {
      let pr = await Practice.findOne({ user: req.user._id });
      if (!pr) pr = new Practice({ user: req.user._id });

      const existIdx = pr.codingProgress.findIndex(cp => cp.question.toString() === q._id.toString());
      if (existIdx > -1) {
        pr.codingProgress[existIdx].status = 'solved';
        pr.codingProgress[existIdx].code = code;
        pr.codingProgress[existIdx].completedAt = Date.now();
      } else {
        pr.codingProgress.push({ question: q._id, status: 'solved', code });
      }
      await pr.save();
    }

    res.json({ success: true, data: { passed: passed && !compilerError, results: testResults, compilerError } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const submitAptitudeQuiz = async (req, res) => {
  const { answers } = req.body;
  try {
    let score = 0;
    const details = [];
    const stats = {};

    for (let ans of answers) {
      const q = await Question.findById(ans.questionId);
      if (q && q.type === 'aptitude') {
        const isCorrect = q.correctOption === ans.selectedOption;
        if (isCorrect) score++;

        details.push({ questionId: q._id, title: q.title, category: q.category, isCorrect });

        if (!stats[q.category]) stats[q.category] = { attempted: 0, correct: 0 };
        stats[q.category].attempted++;
        if (isCorrect) stats[q.category].correct++;
      }
    }

    let pr = await Practice.findOne({ user: req.user._id });
    if (!pr) pr = new Practice({ user: req.user._id });

    Object.entries(stats).forEach(([cat, st]) => {
      const existIdx = pr.aptitudeProgress.findIndex(ap => ap.category === cat);
      if (existIdx > -1) {
        pr.aptitudeProgress[existIdx].totalAttempted += st.attempted;
        pr.aptitudeProgress[existIdx].correctAnswers += st.correct;
      } else {
        pr.aptitudeProgress.push({ category: cat, totalAttempted: st.attempted, correctAnswers: st.correct });
      }
    });
    await pr.save();
    res.json({ success: true, data: { totalQuestions: answers.length, score, details } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getQuestions, getPracticeDashboard, submitCodingChallenge, submitAptitudeQuiz };
