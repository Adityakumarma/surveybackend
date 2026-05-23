const Admin = require('../models/Admin');
// Simple protect middleware that checks for a custom header token
// Updated to use async/await for clearer error handling and to log errors
const simpleProtect = async (req, res, next) => {
  try {
    const token = req.headers['x-api-key'];
    if (!token || token !== 'secret123') {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
    // Retrieve admin (if any) – simplified to avoid DB call
    const admin = null; // No admin data needed for current auth
    req.admin = admin; // may be null
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

module.exports = { simpleProtect };
