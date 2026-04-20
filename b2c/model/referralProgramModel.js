const mongoose = require('mongoose');

const referralProgramSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'],
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    trim: true,
    default: null,
  },
  agreedToTerms: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('ReferralProgram', referralProgramSchema);
