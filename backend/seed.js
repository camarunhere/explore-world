require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const User = require('./models/User');
const Destination = require('./models/Destination');
const Review = require('./models/Review');

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    // Clear existing data
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing collections.');

    // Seed Users
    const usersRaw = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf8'));
    const users = usersRaw.map((u) => ({
      userId: u.id,
      full_name: u.full_name,
      email: u.email,
      password: u.password,
      age: u.age,
      gender: u.gender,
      country: u.country || '',
      bio: u.bio || '',
      travel_experience_level: u.travel_experience_level || 'Beginner',
      preferred_activity_type: u.preferred_activity_type || '',
      preferred_region: u.preferred_region || '',
      avg_trip_duration_days: u.avg_trip_duration_days || 0,
      trips_per_year: u.trips_per_year || 0,
      budget_per_trip_usd: u.budget_per_trip_usd || 0,
      posts_submitted: u.posts_submitted || 0,
      reviews_written: u.reviews_written || 0,
      avg_rating_given: u.avg_rating_given || 0,
      wishlist_count: u.wishlist_count || 0,
      account_status: u.account_status || 'Active',
      join_date: u.join_date,
      avatar: u.avatar,
    }));
    await User.insertMany(users);
    console.log(`Seeded ${users.length} users.`);

    // Seed Destinations
    const destinationsRaw = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/destinations.json'), 'utf8'));
    await Destination.insertMany(destinationsRaw);
    console.log(`Seeded ${destinationsRaw.length} destinations.`);

    // Seed Reviews
    const reviewsRaw = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/reviews.json'), 'utf8'));
    const reviews = reviewsRaw.map((r) => ({
      destination_id: r.destination_id,
      user_id: r.user_id,
      user_name: r.user_name,
      user_avatar: r.user_avatar,
      rating: r.rating,
      title: r.title || '',
      content: r.content,
      visit_date: r.visit_date || '',
      created_at: r.created_at,
      helpful_count: r.helpful_count || 0,
    }));
    await Review.insertMany(reviews);
    console.log(`Seeded ${reviews.length} reviews.`);

    console.log('\nSeed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
