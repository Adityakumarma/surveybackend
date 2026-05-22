const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/authController');
// Using simpleProtect middleware defined in authMiddleware


module.exports = router;
