const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, sparse: true }, // legacy id from JSON (T001, etc.)
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  country: { type: String, default: '' },
  bio: { type: String, default: '' },
  travel_experience_level: { type: String, default: 'Beginner' },
  preferred_activity_type: { type: String, default: '' },
  preferred_region: { type: String, default: '' },
  avg_trip_duration_days: { type: Number, default: 0 },
  trips_per_year: { type: Number, default: 0 },
  budget_per_trip_usd: { type: Number, default: 0 },
  posts_submitted: { type: Number, default: 0 },
  reviews_written: { type: Number, default: 0 },
  avg_rating_given: { type: Number, default: 0 },
  wishlist_count: { type: Number, default: 0 },
  account_status: { type: String, default: 'Active' },
  role: { type: String, default: 'user' },
  saved_destinations: { type: [String], default: [] },
  join_date: { type: String },
  avatar: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
