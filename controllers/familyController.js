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
    const page = Math.max(1, Number(req.query.pageNumber) || 1);
    
    const rawKeyword = req.query.keyword ? req.query.keyword.trim() : '';
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const escapedKeyword = escapeRegex(rawKeyword);
const keyword = escapedKeyword
  ? {
      $or: [
        { familyHeadName: { $regex: escapedKeyword, $options: 'i' } },
        { phoneNumber: { $regex: escapedKeyword, $options: 'i' } },
        { pincode: { $regex: escapedKeyword, $options: 'i' } },
        { 'members.name': { $regex: escapedKeyword, $options: 'i' } },
        { 'members.occupation.employmentType': { $regex: escapedKeyword, $options: 'i' } },
        { 'members.occupation.workplace': { $regex: escapedKeyword, $options: 'i' } },
      ],
    }
  : {}; 
    
    const wardFilter = req.query.ward ? { wardNumber: req.query.ward } : {};
    
    let sortQuery = { createdAt: -1 };
    if (req.query.sortBy) {
      const field = req.query.sortBy;
      const order = req.query.sortOrder === 'asc' ? 1 : -1;
      
      if (field === 'pincode') {
        sortQuery = { pincode: order };
      } else if (field === 'phoneNumber') {
        sortQuery = { phoneNumber: order };
      } else if (field === 'jobName') {
        sortQuery = { 'members.occupation.employmentType': order };
      } else if (field === 'familyHeadName') {
        sortQuery = { familyHeadName: order };
      } else if (field === 'wardNumber') {
        sortQuery = { wardNumber: order };
      }
    }

    const count = await Family.countDocuments({ ...keyword, ...wardFilter });
    const families = await Family.find({ ...keyword, ...wardFilter })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(sortQuery);
    
    res.json({ families, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    console.error('Error in getFamilies:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
    console.error('Error in getFamilyById:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
    console.error('Error in deleteFamily:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
    let votingEligible = 0;
    let votingIneligible = 0;
    
    // Compute statistics including breakdown of poor families by category
    const categoryCounts = { BPL: 0, YELLOW: 0, PINK: 0 };
    families.forEach(f => {
      totalMembers += (f.members || []).length;
      if (f.rationCardType) {
        const type = f.rationCardType.toUpperCase();
        if (type === 'BPL' || type === 'YELLOW' || type === 'PINK') {
          bplFamilies++;
          if (categoryCounts.hasOwnProperty(type)) {
            categoryCounts[type]++;
          }
        }
      }
      (f.members || []).forEach(m => {
        if (m.gender && m.gender.toLowerCase() === 'male') maleCount++;
        if (m.gender && m.gender.toLowerCase() === 'female') femaleCount++;
        if (m.age >= 60) seniorCitizens++;
        
        if (m.voterId && m.voterId.trim().length > 0) {
          votingEligible++;
        } else {
          votingIneligible++;
        }
      });
    });

    res.json({
      totalFamilies,
      totalMembers,
      maleCount,
      femaleCount,
      seniorCitizens,
      bplFamilies,
      votingEligible,
      votingIneligible,
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
