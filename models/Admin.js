const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // plain text for demo; replace with hash in prod
});

module.exports = mongoose.model('Admin', adminSchema);
