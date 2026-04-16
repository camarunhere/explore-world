const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'exploreworld_secret_key_2025';

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised, no token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorised, token invalid' });
  }
};

module.exports = { protect, JWT_SECRET };
