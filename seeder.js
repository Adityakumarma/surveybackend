const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    await Admin.deleteMany();
    const admin = new Admin({
      email: 'admin@payyoli.gov.in',
      password: 'admin123'
    });
    await admin.save();
    console.log('Admin seeded!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
