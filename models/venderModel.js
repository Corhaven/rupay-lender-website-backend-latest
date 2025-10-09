
const  mongoose  = require("mongoose");
// const { currentMonthAndYearInString } = require("../helpers/hashpassword");
const { number } = require("joi");
const dayjs = require("dayjs");


// const MobileNumberValidator = {
//   value: {
//     type: Number,
//   },
//   verified: {
//     type: Boolean,
//     trim: true,
//   },
//   otp: { type: Number, select: false },
// };

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
 let companyDetailSchema = new mongoose.Schema({
   companyName :{
    type : String
   },
   
   companyAddress : {
    type : String
   },
   companyPinCode :{
    type : Number
   },companyEmail :{
    type : String
   }
 })
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
let panDetails = ({
  
  name:{
    type:String,
  },
  pan:{
    type : String
  },
  panType:{
    type:String,
  },

 
  valid:{
    type:Boolean,
  },
  
});
let gstDetails = new mongoose.Schema({
  reference_id: {
    type: String,
  },
    GSTIN:  {
      type: String,
    },
    legal_name_of_business:  {
      type: String,
    },
   
    date_of_registration:  {
      type: String,
    },
    constitution_of_business: {
      type: String,
    },
    taxpayer_type:  {
      type: String,
    },
    gst_in_status : {
    type: String,
  },
    nature_of_business_activities: [String],
    principal_place_address:  {
      type: String,
    },
    valid:  {
      type: Boolean,
    },
})
 const userdocsData = {
  panCard: {
    type: String,
  },
      aadharfront: {
    type: String,
  },
  gstMsmeCerificate:{
    type: String,

  },
  pic: {
    type: String,
  }}
  const  commisionRateSchema = new mongoose.Schema({
    bank: {
      type: String,
      required: true
    },
    loanType: {
      type: String,
      required: true
    },
    rate: {
      type: Number,
      required: true
    }
 
  });
const vendorSchema = new mongoose.Schema(
 { 
  basicInfo : {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true ,
    unique : true   },
   
    // mobile: MobileNumberValidator,
    mobile: {
      type: Number,
      required: true,
      unique : true
    },

   
  
  plan :{
    type : String,

  },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pinCode :{
      type : Number,
      required : true
     },
    address: {
      type: String,
      required: true,
    },
    referral :{
      type : String
     },
     leadStatus :{
      type: String,
      
      enum: ['pending','Called- No response',
        ,'Call back in sometime','Documents awaited',
       'Final On-Boarding'],
       default : 'pending'
  },
    experience :{
    type : Boolean
  }},
  walletBalance : { type: Number, default: 0 },

  memberSince:
   { type: String, default: dayjs(Date.now()).format('DD MMM YYYY') },
   companyDetail : companyDetailSchema,
   bankDetail : bankDetailSchema,
   gstDetails : {
    type : gstDetails
   },
   aadharDetails : {
    type :aadharDetails
   },
   
   panDetails : {
    type :panDetails

   },
   userdocs :  {
    type : userdocsData
   } ,
   commisionRate: commisionRateSchema,
 
  otp: String, // For OTP verification
  otpExpires: Date ,
  isVerified: {
    type: Boolean,
    default: false
  },
  paymentStatus : {type:String,enum:["paid","unpaid"],default:"unpaid"},
  
  activeStatus: { type: String, enum: ['active', 'inactive','pending'], default: 'pending' },
  whatsUppOpt :{
    type: Boolean,
    default: false
  },
  token :{
    type : String
  },
  fcmToken: {
    type: String,
  },
  venderID : {
    type: String,
  },
  remarks: {
    type: String,
    default: ''
  },
  role: { type: String, enum: ['admin', 'sub-admin', 'vendor'], default: 'vendor' }
  },
 
  { timestamps: true }
);
vendorSchema.index({ 'basicInfo.mobile': 1 ,'basicInfo.email' : 1});

module.exports =  mongoose.model("Vendor", vendorSchema);

// module.exports = {aadharDetails}
