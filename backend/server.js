require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected to ExploreWorld cluster'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain and listed origins
    if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/reviews', require('./routes/reviews'));

// Root
app.get('/', (req, res) => res.json({
  name: 'ExploreWorld API',
  version: '2.0.0',
  status: 'running',
  db: 'MongoDB Atlas',
  endpoints: [
    'GET  /api/health',
    'GET  /api/destinations',
    'GET  /api/destinations/featured',
    'GET  /api/destinations/stats',
    'GET  /api/destinations/:id',
    'POST /api/destinations',
    'POST /api/auth/register',
    'POST /api/auth/login',
    'GET  /api/auth/me',
    'PUT  /api/auth/profile',
    'GET  /api/reviews/destination/:id',
    'POST /api/reviews',
  ],
}));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ExploreWorld API running', version: '2.0.0', db: 'MongoDB Atlas' }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🌍 ExploreWorld API running on http://localhost:${PORT}`);
  console.log(`📚 Endpoints:`);
  console.log(`   GET  /api/destinations`);
  console.log(`   GET  /api/destinations/:id`);
  console.log(`   POST /api/auth/register`);
  console.log(`   POST /api/auth/login\n`);
});
