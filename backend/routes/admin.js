const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Destination = require('../models/Destination');
const User = require('../models/User');

// GET /api/admin/destinations — all destinations including pending
router.get('/destinations', protect, adminOnly, async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ submission_date: -1 }).lean();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [total, pending, approved, rejected, users] = await Promise.all([
      Destination.countDocuments(),
      Destination.countDocuments({ post_status: 'Pending' }),
      Destination.countDocuments({ post_status: 'Approved' }),
      Destination.countDocuments({ post_status: 'Rejected' }),
      User.countDocuments(),
    ]);
    res.json({ total, pending, approved, rejected, users });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
