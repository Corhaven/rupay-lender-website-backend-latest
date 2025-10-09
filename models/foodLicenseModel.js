const dayjs = require("dayjs");
const { required } = require("joi");
const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  personalEmail: { type: String, required: true },
  contactNo: { type: Number, required: true },
   
});

const addressSchema = new mongoose.Schema({
  shopFlatDoorNo: { type: String, required: true },
  nearBy: { type: String },
  roadStreet: { type: String },
  areaLocality: { type: String },
  city: { type: String, required: true },
  pinCode: { type: Number, required: true },
  state: { type: String, required: true },
});
  
// const foodLicenseSchema = new mongoose.Schema({
//   personOrBusinessName: { type: String, required: true },
//   email: { type: String, required: true },
//   mobile: { type: Number, required: true },
//   natureOfBusiness: { type: String, required: true },
//   designation: { type: String, required: true },
//   address: { type: addressSchema, required: true },
//   applicantDetails: { type: applicantSchema, required: true },
//   photoId: { type: String, required: true },
//   businessAddressProof: { type: String }, // e.g., path to file or URL
//   businessPremisesProof: { type: String }, // e.g., path to file or URL
//   businessConstitution: { type: String }, // e.g., path to file or URL
//   foodSafetyPlan: { type: String }, // e.g., path to file or URL
//   foodProductList: { type: String }, // List of food products
//   bankAccountInformation: { type: String, required: true }, // e.g., bank account details
//   amount :{type : Number, required : true},
//   createdAt: { type: Date, default: Date.now },
  
// });
const userDocs = {
  photoId: { type: String, },
  businessAddressProof: { type: String }, // e.g., path to file or URL
  businessPremisesProof: { type: String }, // e.g., path to file or URL
  businessConstitution: { type: String }, // e.g., path to file or URL
  foodSafetyPlan: { type: String }, // e.g., path to file or URL
  foodProductList: { type: String }, // List of food products
  bankAccountInformation: { type: String,  }, // e.g., bank account details
  
}
const foodLicenseSchema = new mongoose.Schema({
  name: { type: String,},
  email: { type: String, },
  mobile: { type: Number, },
  natureOfBusiness: { type: String, },
  designation: { type: String,},
  address: { type: addressSchema,  },
  applicantDetails: { type: applicantSchema, },
 
  userDocs: userDocs,
  status :{
    type:String,
    default:"In-Process"
   },  payout:{
    type: Number,
},    paidDate :{type: String},
    
  amount :{type : Number},
  applicationID : {
    type: String,
    required: true
},
    
  vendorMongooseId:{
         type: mongoose.Schema.Types.ObjectId, ref: 'vendor', required: true 
     },
     vendorId :{
         type:String,
         required:true
     },
     createdAt:{
         type:String,
         default:dayjs(Date.now()).format("MMM D, YYYY h:mm A")
     }
  
});
module.exports = mongoose.model('foodLicenseModel', foodLicenseSchema);
