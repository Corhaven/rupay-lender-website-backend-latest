const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
   
  },
  earning: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const Earning = mongoose.model('Earning', earningSchema);

module.exports = Earning;
