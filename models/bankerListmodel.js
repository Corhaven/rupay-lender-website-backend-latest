const mongoose = require("mongoose");

const bankerListSchema = new mongoose.Schema({
  pincode: {
    type: Number,
    required: true
  },
  bankerName: {
    type: String,
    // required: true,
    // trim: true
  },
  products: {
    type: String,
    // required: true,
    // trim: true
  },
  bankName: {
    type: String,
    // required: true,
    // trim: true
  },
  mobile: {
    type: Number,
    // required: true,
    // match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"]
  }
}, { timestamps: true });

module.exports  = mongoose.model("bankerList", bankerListSchema);

