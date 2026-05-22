const express = require('express');
const router = express.Router();
const {
  createFamily,
  getFamilies,
  getFamilyById,
  updateFamily,
  deleteFamily,
  getStats
} = require('../controllers/familyController');
const { simpleProtect } = require('../middleware/authMiddleware');

router.route('/').post(simpleProtect, createFamily).get(simpleProtect, getFamilies);
router.get('/stats/dashboard', getStats);
router.route('/:id').get(simpleProtect, getFamilyById).put(simpleProtect, updateFamily).delete(simpleProtect, deleteFamily);

module.exports = router;
