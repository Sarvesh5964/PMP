const mongoose = require('mongoose');

const PracticeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  codingProgress: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    status: { type: String, enum: ['started', 'solved'], default: 'started' },
    code: String,
    completedAt: { type: Date, default: Date.now }
  }],
  aptitudeProgress: [{
    category: { type: String, required: true },
    totalAttempted: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  }],
  mockInterviews: [{
    role: { type: String, required: true },
    score: { type: Number, default: 0 },
    feedback: {
      score: Number,
      strengths: [String],
      weaknesses: [String],
      suggestions: [String]
    },
    transcript: [{
      speaker: { type: String, enum: ['Interviewer', 'Student'] },
      message: String
    }],
    date: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Practice', PracticeSchema);
