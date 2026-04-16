const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  destination_id: { type: String, unique: true },
  post_title: { type: String, required: true },
  submitted_by: { type: String }, // userId string (legacy or MongoDB _id string)
  submitter_name: { type: String },
  country: { type: String, required: true },
  region: { type: String, default: '' },
  continent: { type: String, default: 'Unknown' },
  activity_type: { type: String, required: true },
  difficulty_level: { type: String, default: 'Moderate' },
  best_time_to_visit: { type: String, default: 'All Year' },
  avg_trip_duration_days: { type: Number, default: 3 },
  estimated_cost_usd: { type: Number, default: 0 },
  avg_rating: { type: Number, default: 0 },
  total_reviews: { type: Number, default: 0 },
  total_saves: { type: Number, default: 0 },
  total_views: { type: Number, default: 0 },
  post_status: { type: String, default: 'Pending' },
  submission_date: { type: String },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  description_summary: { type: String, default: '' },
  full_description: { type: String, default: '' },
  accessibility: { type: String, default: 'Moderate' },
  accommodation_type: { type: String, default: '' },
  nearest_major_city: { type: String, default: '' },
  distance_from_major_city_km: { type: Number, default: 0 },
  is_hidden_gem: { type: Boolean, default: false },
  environmental_sensitivity: { type: String, default: 'Medium' },
  tags: { type: [String], default: [] },
  image: { type: String, default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80' },
  gallery: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
