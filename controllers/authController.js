
const Admin = require('../models/Admin');


const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (admin && admin.password === password) {
      // Successful login
      res.json({ _id: admin._id, email: admin.email, message: 'Login successful' });
    } else {
      // Invalid credentials
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { loginAdmin };
