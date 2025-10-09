const mongoose = require('mongoose');
let bankDetailSchema = new mongoose.Schema({
  name_at_bank :{
    type:String,
  },
 
  ifsc:{
    type:String,
  },
  bank_account:{
    type:Number,
  },
  reference_id :{
    type:String,
  },
  bank_name:{
    type:String,
  },
phone :{
  type:Number,

},
    city:{
      type:String,
    },
    branch:{
      type:String,
    },
    micr:{
      type:String,
    },
    account_status:{
      type:String,
    }
});
const customerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
       email :{
    type: String,}
,  mobile: {
    type: String,
    required: true,
    unique: true,
    // match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'],
  },
  state :{
    type: String,
    // required: true,
  }
  ,district:{
    type: String,
  },
  shopID :{
    type: String,
  },
  referral: {
    type: String,
    trim: true,
  },
  earning: {
    type: Number,
    default: 0,
  },
  bankDetail: {
    type: bankDetailSchema,
  },
  isBankVerified:{
    type: Boolean,
    default: false,
  },
  whatsUppOpt: {
    type: Boolean,
    default: false,
  },
  pan_no:{
    type: String,
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
