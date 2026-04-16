const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  destination_id: { type: String, required: true },
  user_id: { type: String, required: true },
  user_name: { type: String },
  user_avatar: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, default: '' },
  content: { type: String, required: true },
  visit_date: { type: String, default: '' },
  created_at: { type: String },
  helpful_count: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
