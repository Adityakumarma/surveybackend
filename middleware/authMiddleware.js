const Admin = require('../models/Admin');
// Simple protect middleware that checks for a custom header token
const simpleProtect = (req, res, next) => {
  const token = req.headers['x-api-key'];
  if (token && token === 'secret123') {
    Admin.findOne().then(admin => {
      req.admin = admin;
      next();
    }).catch(() => {
      res.status(500).json({ message: 'Server error' });
    });
  } else {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

module.exports = { simpleProtect };
