const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Destination = require('../models/Destination');

// GET /api/destinations
router.get('/', protect, async (req, res) => {
  try {
    const { continent, activity_type, difficulty_level, search, sort, min_cost, max_cost } = req.query;
    const filter = {};

    if (continent) filter.continent = continent;
    if (activity_type) filter.activity_type = activity_type;
    if (difficulty_level) filter.difficulty_level = difficulty_level;
    if (min_cost || max_cost) {
      filter.estimated_cost_usd = {};
      if (min_cost) filter.estimated_cost_usd.$gte = Number(min_cost);
      if (max_cost) filter.estimated_cost_usd.$lte = Number(max_cost);
    }
    if (search) {
      const q = search.trim();
      filter.$or = [
        { post_title: { $regex: q, $options: 'i' } },
        { country: { $regex: q, $options: 'i' } },
        { region: { $regex: q, $options: 'i' } },
        { description_summary: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ];
    }

    let sortObj = {};
    if (sort === 'rating') sortObj = { avg_rating: -1 };
    else if (sort === 'popular') sortObj = { total_views: -1 };
    else if (sort === 'cost_asc') sortObj = { estimated_cost_usd: 1 };
    else if (sort === 'cost_desc') sortObj = { estimated_cost_usd: -1 };
    else if (sort === 'newest') sortObj = { submission_date: -1 };

    const destinations = await Destination.find(filter).sort(sortObj).lean();
    res.json(destinations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/destinations/featured
router.get('/featured', async (req, res) => {
  try {
    const featured = await Destination.find({ avg_rating: { $gte: 4.6 } })
      .sort({ avg_rating: -1 })
      .limit(6)
      .lean();
    res.json(featured);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/destinations/stats
router.get('/stats', async (req, res) => {
  try {
    const [total, hiddenGems, agg] = await Promise.all([
      Destination.countDocuments(),
      Destination.countDocuments({ is_hidden_gem: true }),
      Destination.aggregate([
        {
          $group: {
            _id: null,
            total_views: { $sum: '$total_views' },
            total_reviews: { $sum: '$total_reviews' },
            continents: { $addToSet: '$continent' },
          },
        },
      ]),
    ]);

    const data = agg[0] || { total_views: 0, total_reviews: 0, continents: [] };
    res.json({
      total_destinations: total,
      total_continents: data.continents.length,
      total_views: data.total_views,
      total_reviews: data.total_reviews,
      hidden_gems: hiddenGems,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/destinations/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const dest = await Destination.findOneAndUpdate(
      { destination_id: req.params.id },
      { $inc: { total_views: 1 } },
      { new: true }
    ).lean();
    if (!dest) return res.status(404).json({ message: 'Destination not found' });
    res.json(dest);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/destinations (auth required)
router.post('/', protect, async (req, res) => {
  try {
    const {
      post_title, country, region, continent, activity_type, difficulty_level,
      best_time_to_visit, avg_trip_duration_days, estimated_cost_usd,
      description_summary, full_description, accessibility, accommodation_type,
      nearest_major_city, distance_from_major_city_km, latitude, longitude,
      environmental_sensitivity, tags, image,
    } = req.body;

    if (!post_title || !country || !activity_type)
      return res.status(400).json({ message: 'post_title, country, and activity_type are required' });

    const count = await Destination.countDocuments();
    const destination_id = `D${String(count + 1).padStart(3, '0')}`;

    const newDest = await Destination.create({
      destination_id,
      post_title,
      submitted_by: req.user.id,
      submitter_name: req.user.full_name,
      country,
      region: region || '',
      continent: continent || 'Unknown',
      activity_type,
      difficulty_level: difficulty_level || 'Moderate',
      best_time_to_visit: best_time_to_visit || 'All Year',
      avg_trip_duration_days: Number(avg_trip_duration_days) || 3,
      estimated_cost_usd: Number(estimated_cost_usd) || 0,
      post_status: 'Pending',
      submission_date: new Date().toISOString().split('T')[0],
      latitude: Number(latitude) || 0,
      longitude: Number(longitude) || 0,
      description_summary: description_summary || '',
      full_description: full_description || '',
      accessibility: accessibility || 'Moderate',
      accommodation_type: accommodation_type || '',
      nearest_major_city: nearest_major_city || '',
      distance_from_major_city_km: Number(distance_from_major_city_km) || 0,
      is_hidden_gem: true,
      environmental_sensitivity: environmental_sensitivity || 'Medium',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
      image: image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
      gallery: [image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'],
    });

    res.status(201).json(newDest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/destinations/:id/save (toggle save)
router.post('/:id/save', protect, async (req, res) => {
  try {
    const dest = await Destination.findOneAndUpdate(
      { destination_id: req.params.id },
      { $inc: { total_saves: 1 } },
      { new: true }
    );
    if (!dest) return res.status(404).json({ message: 'Destination not found' });
    res.json({ total_saves: dest.total_saves });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
