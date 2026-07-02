const Question = require('../models/Question');
const Practice = require('../models/Practice');
const { evaluateInterviewAnswer } = require('../services/aiService');

const startInterview = async (req, res) => {
  const { role } = req.body;
  try {
    let qList = await Question.find({ type: 'interview', category: role }).limit(4);
    if (!qList || qList.length === 0) {
      qList = await Question.find({ type: 'interview' }).limit(4);
    }
    res.json({ success: true, data: { role, questions: qList } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const submitInterview = async (req, res) => {
  const { role, transcript } = req.body;
  try {
    let totalScore = 0;
    const strengths = [], weaknesses = [], suggestions = [];
    const dbTranscript = [];

    for (let item of transcript) {
      const evalResult = await evaluateInterviewAnswer(item.question, item.answer, item.category);
      totalScore += evalResult.score;
      evalResult.strengths.forEach(s => { if (!strengths.includes(s)) strengths.push(s); });
      evalResult.weaknesses.forEach(w => { if (!weaknesses.includes(w)) weaknesses.push(w); });
      evalResult.suggestions.forEach(sg => { if (!suggestions.includes(sg)) suggestions.push(sg); });

      dbTranscript.push({ speaker: 'Interviewer', message: item.question });
      dbTranscript.push({ speaker: 'Student', message: item.answer });
    }

    const overallScore = Math.round((totalScore / (transcript.length * 10)) * 100);
    const session = {
      role, score: overallScore, date: Date.now(), transcript: dbTranscript,
      feedback: { score: overallScore, strengths, weaknesses, suggestions }
    };

    let pr = await Practice.findOne({ user: req.user._id });
    if (!pr) pr = new Practice({ user: req.user._id });
    pr.mockInterviews.push(session);
    await pr.save();

    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { startInterview, submitInterview };
