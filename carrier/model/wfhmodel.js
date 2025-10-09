const mongoose  =require("mongoose")
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
   })
const wfhSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true 
    },
    referral :{
           type : String,
    },
    mobile :{

        type : Number,
        required : true
    },
    address:{
        type : String,
        required : true
    },
    city :{
        type : String,
        required : true
    },
    state :{
        type : String,
        required : true
    },
    pinCode: {
        type : Number,
        required : true
    },
    product :{
        type : String,
        required : true
    },
    role :{
        type : String,
        required : true
    },
    venderID :{
        type : String,
        required : true
    },
      activeStatus: { type: String, enum: ['active', 'inactive','pending'], default: 'pending' },
    cv:{
        type : String,
        required : true   
    },
    whatsUppOpt :{
        type : Boolean,
        default : false

    },
     aadharDetails : {
    type :aadharDetails
   },
   
   panDetails : {
    type :panDetails

   },
    bankDetail : bankDetailSchema,
    isBankVerified :{
      type:Boolean
    },
  activeStatus: { type: String, enum: ['active', 'inactive','pending'], default: 'pending' },
},{ timestamps: true} )


  module.exports= mongoose.model('wfh' ,wfhSchema)