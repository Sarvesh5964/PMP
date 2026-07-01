const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  drive: { type: mongoose.Schema.Types.ObjectId, ref: 'PlacementDrive', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['applied', 'shortlisted', 'selected', 'rejected'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now }
});

ApplicationSchema.index({ drive: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
