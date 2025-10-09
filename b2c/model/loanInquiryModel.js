
const mongoose = require("mongoose");

// const { currentMonthAndYearInString } = require("../../helpers/hashpassword");
const dayjs = require("dayjs");
// const document = require("./documentModel");
const { Schema } = mongoose;

const loanInquirySchema = new Schema(
  {   
    username:{
        type : String
      },
      referred:{
        type: String,
      },
    mobile :{
        type : String
      },  
      earning :{
        type: Number,
    default: 0,
      },
       email :{
        type : String
      },
      dob:{
        type : String
      },
 pincode :{
 type : Number
 },
      district:{
        type : String
      }
      ,state:{
        type : String
      },
      pan_no :{
        type : String
      },
      monthlyIncome :{
  type : Number
      },
      employmentType :{

          type: String,
      },
    applicationID :{
      type : String
    },
    whatsUppOpt :{
      type : Boolean,
      default : false
    },
    insuranceType:{
      type: String,
      enum: ['Car Insurance', 'Bike Insurance', 'Commercial Insurance'],
    },
    type :  {
        type: String,
        enum: ['personal loan', 'home loan', 'loan against property','loan against property bt',
          'used car loan','business loan','used car loan bt','education loan',
         'home loan balance transfer','personal loan balance transfer','credit card','motor insurance','web dev','used car loan','professional loan','social media','graphic design',],
    
         
      },
               
    status :{
        type: String,        
        enum: ['pending','Called-No response',
          ,'Call back in sometime','Documents awaited',
         'Offer shared','Final verification','Disbursed','Overdue',"Cibil less than 650","Cibil more than 700","Multiple loans in 6 months","Multiple inquiries"],
         default : 'pending'
    },
   propertyType :{ 
    type: String,
   },
   marketValueofProperty:{
    type: Number,
   },
   requiredLoan :{
    type: Number,

   },
       projectType: {
        type: String,
      
    },
    typeOfWebsite :{
      type : String,
  },
     createdInquiry:
     { type: String, default: dayjs(Date.now()).format('DD-MM-YYYY') },
   profession :{
    type: String,
     enum :['doctor', 'ca','architect']
   },
   address  :{
    type: String,

   },
   New_vehicle_old  : {
    type : Number,
},

car_Bike:{
    type : String,

},
brand_Name:{
    type : String,

},
car_Number: {
    type : String,

},
rc_Number :{
type : String,

},
manufacturing_Year :{
type : Number,


},
typeOfWebsite :{
  type : String,
},
description :{
  type : String,
},
shopID :{
  type: String,
},  
duplicateInquiry :{
  type: Boolean,
  default: false
},       
  },{ timestamps: true} 
);


loanInquirySchema.index({ mobile: 1 ,referred : 1});
module.exports=  mongoose.model("loanInquiry",loanInquirySchema);


