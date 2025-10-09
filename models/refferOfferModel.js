const mongoose = require('mongoose');

const refferOfferSchema = new mongoose.Schema({
  earnings: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    // enum: ['percentage', 'fixed'], // Example types, customize as needed
    required: true,
  },
  referralCode: {
    type: String,
    required: true,  
    unique: true,
  },
  referralLink: {
    type: String,
    required: true,
  },
},
{timestamps:true});

module.exports = mongoose.model('refferOffer', refferOfferSchema);
