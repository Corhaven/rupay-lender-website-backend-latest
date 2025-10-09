const  mongoose  = require("mongoose");
const subAdmSchema = new mongoose.Schema(
{
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true ,
      unique : true  
   },
   
    // mobile: MobileNumberValidator,
    mobile: {
      type: Number,
      required: true,
      unique : true
    },
   department :{
    type : [String],
    enum: ['personal loan', 'home loan', 'loan against property',
      'used car loan','business loan','ca','credit card',"vendor lead","motor insurance","web dev","social media","graphic design","professional loan","Network lead"],
    required: true,
  },
    
  //  password: {
  //   type: String,
  //   required: true,
  // },
 // blogger, 
  role: { type: String, enum: ['admin', 'backend', 'verifier','blogger','B2B Lead Manager', 'Franchise Manager','B2C Lead Manager','distributor',"Network Lead Manager"] ,
    required : true,
  },
  referral :{

    type : String,
  
   },
   referralLink :{
    type : String,
 
   },
  //  status:{
    active: {
    type: Boolean,
    default: true
  },
  //  }
   
   permissions: {
    updateLoanStatus: { type: Boolean, default: false },
    updatePaymentStatus: { type: Boolean, default: false },
    downloanLoanDetails :{ type: Boolean, default: false },
    createBlog :{ type: Boolean, default: false },
    b2cSales :{ type: Boolean, default: false },
    createJob :{ type: Boolean, default: false },
        // franchiseLead :{ type: Boolean, default: false }

  }
 }
);

module.exports =  mongoose.model("subAdm", subAdmSchema);
