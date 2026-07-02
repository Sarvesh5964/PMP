const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  cgpa: { type: Number, default: 0 },
  skills: { type: [String], default: [] },
  projects: { type: String, default: '' },
  internships: { type: String, default: '' },
  certificates: { type: String, default: '' },
  education: [{
    institution: String,
    degree: String,
    year: Number,
    score: String
  }],
  resumeUrl: { type: String, default: '' },
  resumeAnalysis: {
    score: { type: Number, default: 0 },
    detectedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    suggestions: { type: [String], default: [] }
  },
  completed: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

ProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Profile', ProfileSchema);
