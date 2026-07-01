const mongoose = require('mongoose');

const PlacementDriveSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  jobRole: { type: String, required: true },
  description: { type: String, required: true },
  package: { type: Number, required: true },
  criteria: {
    minCgpa: { type: Number, default: 0 },
    requiredSkills: { type: [String], default: [] }
  },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['active', 'completed', 'upcoming'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlacementDrive', PlacementDriveSchema);
