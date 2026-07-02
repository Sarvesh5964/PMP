const Profile = require('../models/Profile');
const PlacementDrive = require('../models/PlacementDrive');
const Application = require('../models/Application');
const { analyzeResume, recommendCompanies } = require('../services/aiService');

const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await Profile.create({ user: req.user._id, cgpa: 0, skills: [], projects: '', internships: '', certificates: '', education: [] });
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { cgpa, skills, projects, internships, certificates, education } = req.body;
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) profile = new Profile({ user: req.user._id });

    profile.cgpa = cgpa !== undefined ? cgpa : profile.cgpa;
    profile.skills = skills || profile.skills;
    profile.projects = projects !== undefined ? projects : profile.projects;
    profile.internships = internships !== undefined ? internships : profile.internships;
    profile.certificates = certificates !== undefined ? certificates : profile.certificates;
    profile.education = education || profile.education;
    profile.completed = true;

    await profile.save();
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.resumeUrl = `/uploads/${req.file.filename}`;

    const textMock = `RESUME OF: ${req.user.name}\nEmail: ${req.user.email}\nCGPA: ${profile.cgpa}\nSkills: ${profile.skills.join(', ')}\nProjects: ${profile.projects}\nInternships: ${profile.internships}\nCertificates: ${profile.certificates}`;
    profile.resumeAnalysis = await analyzeResume(textMock, profile.skills);

    await profile.save();
    res.json({ success: true, message: 'Resume analyzed successfully', data: { resumeUrl: profile.resumeUrl, resumeAnalysis: profile.resumeAnalysis } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(400).json({ success: false, message: 'Profile missing' });
    
    const drives = await PlacementDrive.find({ status: 'active' });
    const recommendations = await recommendCompanies(profile, drives);
    res.json({ success: true, data: recommendations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.find({ status: 'active' });
    res.json({ success: true, data: drives });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const applyToDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) return res.status(404).json({ success: false, message: 'Drive not found' });

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(400).json({ success: false, message: 'Complete profile first' });

    if (profile.cgpa < drive.criteria.minCgpa) {
      return res.status(400).json({ success: false, message: 'CGPA below cutoff criteria' });
    }

    const exist = await Application.findOne({ drive: drive._id, student: req.user._id });
    if (exist) return res.status(400).json({ success: false, message: 'Already applied' });

    const appCreated = await Application.create({ drive: drive._id, student: req.user._id });
    res.status(201).json({ success: true, data: appCreated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const apps = await Application.find({ student: req.user._id }).populate('drive');
    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProfile, updateProfile, uploadResume, getRecommendations, getDrives, applyToDrive, getApplications };
