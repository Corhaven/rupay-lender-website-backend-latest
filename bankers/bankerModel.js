const mongoose = require('mongoose');
let aadharDetails = ({
  
    name:{
      type:String,
    },
    aadhaar_number:{
      type : Number
    },
    gender:{
      type:String,
    },
    care_of :{
      type:String,
  
    },
   
    dob:{
      type:String,
    },
    status :{
      type : String
    },
    ref_id :{
      type : Number
    },
    address :{
      type : String
  
    },
    imageUrl :{
      type : String
    }
  
  });
const bankerSchema = new mongoose.Schema({
  personalInfo: {
    firstName: String,
    lastName: String,
    mobile: String,
    personalEmail: String,
    location: {
      city: String,
      state: String,
      pinCode: String,
    }
  },
  bankInfo: {
    bankName: String,
    designation: String,
    officialEmail : String
  },
  whatsUppOpt :{
    type : Boolean,
    default : false
  },
  kycDocuments: {
    employeCard: String, // File path
    // panCard: String, // File path
  },
 
   aadharDetails :
   {
    type :aadharDetails
   },
  loanDetails: {
    loanTypes: [String],
    areaTypes: [String],
  },

  policyDetails: String,
}, { timestamps: true });

module.exports = mongoose.model('Banker', bankerSchema);




