const Family = require('../models/Family');


const createFamily = async (req, res) => {
  try {
    const family = new Family(req.body);
    const createdFamily = await family.save();
    res.status(201).json(createdFamily);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFamilies = async (req, res) => {
  try {
    const pageSize = 15;
    const page = Number(req.query.pageNumber) || 1;
    
    const keyword = req.query.keyword
      ? {
          $or: [
            { familyHeadName: { $regex: req.query.keyword, $options: 'i' } },
            { phoneNumber: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};
    
    const wardFilter = req.query.ward ? { wardNumber: req.query.ward } : {};
    
    const count = await Family.countDocuments({ ...keyword, ...wardFilter });
    const families = await Family.find({ ...keyword, ...wardFilter })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });
    
    res.json({ families, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get family by ID
// @route   GET /api/families/:id
// @access  Private
const getFamilyById = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (family) {
      res.json(family);
    } else {
      res.status(404).json({ message: 'Family not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update family
// @route   PUT /api/families/:id
// @access  Private
const updateFamily = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);

    if (family) {
      Object.assign(family, req.body);
      const updatedFamily = await family.save();
      res.json(updatedFamily);
    } else {
      res.status(404).json({ message: 'Family not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete family
// @route   DELETE /api/families/:id
// @access  Private
const deleteFamily = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);

    if (family) {
      await family.deleteOne();
      res.json({ message: 'Family removed' });
    } else {
      res.status(404).json({ message: 'Family not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get statistics for dashboard
// @route   GET /api/families/stats/dashboard
// @access  Private
const getStats = async (req, res) => {
  try {
    const totalFamilies = await Family.countDocuments();
    
    const families = await Family.find({});
    
    let totalMembers = 0;
    let maleCount = 0;
    let femaleCount = 0;
    let seniorCitizens = 0;
    let bplFamilies = 0;
    
    // Compute statistics including breakdown of poor families by category
    const categoryCounts = { BPL: 0, YELLOW: 0, PINK: 0 };
    families.forEach(f => {
      totalMembers += f.members.length;
      if (f.rationCardType) {
        const type = f.rationCardType.toUpperCase();
        if (type === 'BPL' || type === 'YELLOW' || type === 'PINK') {
          bplFamilies++;
          if (categoryCounts.hasOwnProperty(type)) {
            categoryCounts[type]++;
          }
        }
      }
      f.members.forEach(m => {
        if (m.gender && m.gender.toLowerCase() === 'male') maleCount++;
        if (m.gender && m.gender.toLowerCase() === 'female') femaleCount++;
        if (m.age >= 60) seniorCitizens++;
      });
    });

    res.json({
      totalFamilies,
      totalMembers,
      maleCount,
      femaleCount,
      seniorCitizens,
      bplFamilies,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createFamily,
  getFamilies,
  getFamilyById,
  updateFamily,
  deleteFamily,
  getStats
};
