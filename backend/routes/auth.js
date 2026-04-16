const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect, JWT_SECRET } = require('../middleware/auth');
const User = require('../models/User');

const signToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), email: user.email, full_name: user.full_name },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

const safeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.__v;
  // expose _id as id for frontend compatibility
  obj.id = obj._id ? obj._id.toString() : obj.id;
  return obj;
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password, country, bio } = req.body;
    if (!full_name || !email || !password)
      return res.status(400).json({ message: 'Please provide name, email and password' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      full_name,
      email: email.toLowerCase(),
      password: hashed,
      country: country || '',
      bio: bio || '',
      travel_experience_level: 'Beginner',
      account_status: 'Active',
      join_date: new Date().toISOString().split('T')[0],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name)}&background=10b981&color=fff&size=128`,
    });

    const token = signToken(newUser);
    res.status(201).json({ token, user: safeUser(newUser) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Please provide email and password' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    res.json({ token, user: safeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const obj = user.toObject();
    obj.id = obj._id.toString();
    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const allowed = ['full_name', 'bio', 'country', 'preferred_activity_type', 'preferred_region', 'travel_experience_level'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const obj = user.toObject();
    obj.id = obj._id.toString();
    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
