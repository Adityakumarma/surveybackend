const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/authController');
router.post('/login', loginAdmin);

// Example protected route (optional)
router.get('/protected', (req, res) => {
  res.json({ message: 'Protected route accessed' });
});
