const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/authController');
// Using simpleProtect middleware defined in authMiddleware
const { simpleProtect } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/protected', simpleProtect, (req, res) => {
  res.json({ message: 'You have accessed a protected route!' });
});

module.exports = router;
