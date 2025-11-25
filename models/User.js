const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    // Optional profile fields default to null
    phone: { type: String, default: null },
    address: { type: String, default: null },
    city: { type: String, default: null },
    pincode: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
