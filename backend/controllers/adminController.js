const User = require('../models/User');
const Profile = require('../models/Profile');
const PlacementDrive = require('../models/PlacementDrive');
const Application = require('../models/Application');
const Question = require('../models/Question');
const Practice = require('../models/Practice');

const getAdminDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalDrives = await PlacementDrive.countDocuments();
    const totalApplications = await Application.countDocuments();
    const selectedCount = await Application.countDocuments({ status: 'selected' });
    const selectionRate = totalApplications > 0 ? Math.round((selectedCount / totalApplications) * 100) : 0;

    const drives = await PlacementDrive.find();
    const avgPackage = drives.length > 0 ? Math.round((drives.reduce((acc, curr) => acc + curr.package, 0) / drives.length) * 10) / 10 : 0;

    const profiles = await Profile.find();
    const resumeScores = profiles.map(p => p.resumeAnalysis?.score || 0).filter(s => s > 0);
    const avgResumeScore = resumeScores.length > 0 ? Math.round(resumeScores.reduce((acc, curr) => acc + curr, 0) / resumeScores.length) : 0;

    res.json({
      success: true,
      data: {
        totalStudents, totalDrives, totalApplications, selectionRate, avgPackage, avgResumeScore,
        applicationStatusCounts: {
          applied: await Application.countDocuments({ status: 'applied' }),
          shortlisted: await Application.countDocuments({ status: 'shortlisted' }),
          selected: selectedCount,
          rejected: await Application.countDocuments({ status: 'rejected' })
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    const enriched = [];
    for (let st of students) {
      enriched.push({
        user: st,
        profile: await Profile.findOne({ user: st._id }),
        practice: await Practice.findOne({ user: st._id })
      });
    }
    res.json({ success: true, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.create(req.body);
    res.status(201).json({ success: true, data: drive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteDrive = async (req, res) => {
  try {
    await PlacementDrive.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ drive: req.params.id });
    res.json({ success: true, message: 'Drive deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const apps = await Application.find().populate('drive').populate('student', 'name email');
    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const appUpdated = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, data: appUpdated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAdminDashboard,
  getStudents,
  createDrive,
  deleteDrive,
  createQuestion,
  deleteQuestion,
  getApplications,
  updateApplicationStatus
};
