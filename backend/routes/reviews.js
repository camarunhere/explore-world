const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');
const Destination = require('../models/Destination');
const User = require('../models/User');

// GET /api/reviews/destination/:id
router.get('/destination/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ destination_id: req.params.id }).lean();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reviews/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ user_id: req.params.userId }).lean();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    const { destination_id, rating, title, content, visit_date } = req.body;
    if (!destination_id || !rating || !content)
      return res.status(400).json({ message: 'destination_id, rating, and content are required' });

    const user = await User.findById(req.user.id).lean();
    const userAvatar = user?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(req.user.full_name)}&background=10b981&color=fff`;

    const newReview = await Review.create({
      destination_id,
      user_id: req.user.id,
      user_name: req.user.full_name,
      user_avatar: userAvatar,
      rating: Number(rating),
      title: title || '',
      content,
      visit_date: visit_date || '',
      created_at: new Date().toISOString().split('T')[0],
      helpful_count: 0,
    });

    // Recalculate destination average rating
    const allReviews = await Review.find({ destination_id }).lean();
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Destination.findOneAndUpdate(
      { destination_id },
      {
        avg_rating: Math.round(avgRating * 10) / 10,
        total_reviews: allReviews.length,
      }
    );

    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/reviews/:id/helpful
router.post('/:id/helpful', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful_count: 1 } },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ helpful_count: review.helpful_count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
