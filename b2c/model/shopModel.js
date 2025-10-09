const mongoose = require('mongoose');
const { bankDetailSchema } = require('../../vendor/vendorSchema');
// const { aadharDetails } = require('../../models/venderModel');
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
const shopSchema = new mongoose.Schema({
  venderID: {
    type: String,
    required: true,
  },
  shopID :{
    type: String,
    required: true,
  },
  category :{
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
    // trim: true,
  },
  personName: {
    type: String,
    required: true,
    // trim: true,
  },
  mobile: {
    type: String,
    required: true,
  },
 bankDetail : bankDetailSchema,
    aadharDetails :
    {
     type :aadharDetails
    },
       panDetails : {
        type :panDetails
    
       },
  pinCode: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

module.exports  = mongoose.model('Shop', shopSchema);

