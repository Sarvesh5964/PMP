const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['aptitude', 'coding', 'interview'], required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  content: { type: String, required: true },
  options: { type: [String], default: [] },
  correctOption: { type: Number },
  testCases: [{
    input: String,
    expectedOutput: String
  }],
  hints: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', QuestionSchema);
