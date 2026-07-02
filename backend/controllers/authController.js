const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_placement_management_portal_key_2026', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

    const user = await User.create({ name, email: cleanEmail, password, role: role || 'student' });
    res.status(201).json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    console.log(`[LOGIN ATTEMPT] Email: "${cleanEmail}" | Password: "${password}"`);
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      console.log(`[LOGIN FAILED] User not found for email: "${cleanEmail}"`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    console.log(`[LOGIN DEBUG] User found. Stored password hash: "${user.password}"`);
    const isMatch = await user.matchPassword(password);
    console.log(`[LOGIN DEBUG] matchPassword result: ${isMatch}`);
    
    if (isMatch) {
      res.json({
        success: true,
        data: { _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMe = async (req, res) => {
  res.json({ success: true, data: { _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
};

module.exports = { registerUser, loginUser, getMe };
