const mongoose = require('mongoose');

const UserPersonalDetailsSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, index: true, unique: true },
    fullName: { type: String, default: null },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    pincode: { type: String, default: null },
    newsletter: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.models.UserPersonalDetails || mongoose.model('UserPersonalDetails', UserPersonalDetailsSchema);


