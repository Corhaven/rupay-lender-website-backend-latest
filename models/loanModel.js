
const mongoose = require("mongoose");
const { personalDetailSchema, professionalDetailSchema, propertyDetailSchema, businessprofessionalDetailSchema, RunningLoanDetailsSchema, carDetailSchema } = require("../common/commonSchema");
const dayjs = require("dayjs");
// const { currentMonthAndYearInString } = require("../helpers/hashpassword");
// const document = require("./documentModel");
const { Schema } = mongoose;
// const { required } = require("joi");
// const currentMonthAndYearInString = () => {
//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const today = new Date();
//   const options = { timeZone: "Asia/Kolkata" }; // IST time zone

//   const istDate = new Date(today.toLocaleString("en-US", options));

//   const formattedDate = `${istDate.getDate()} ${ 
//     monthNames[istDate.getMonth()]
//   } ${istDate.getFullYear()}`;

//   return formattedDate;
// };

const UserDocsData = {
  panCard: {
    type: String,
  },
      aadharfront: {
    type: String,
  },
  aadharback: {
    type: String,
  },
  payslip1: {
    type: String,
  },
  payslip2: {
    type: String,
  },
  payslip3: {
    type: String,
  },
  sevenMonthStatement: {
    type: String,
  },	form16 :{
    type: String,
  },
  form26 :{
    type: String,
  },
  closerLetter1 :{ type: String,},
  closerLetter2 :{ type: String,},

closerLetter3 :{ type: String,},
propertyChain :{
    type: String,
  },
  map :{
    type: String,
  }, gstMsmeCerificate
  : {
      type: String,
    },
  
    itrComution1: {
      type: String,
    },
    itrComution2: {
      type: String,
    },
        itrComution3
     :{
      type: String,
    },
    oneBankStatementCurrentAccount :{
      type: String,
    },
  
    oneYearSavingAccountStatement :{
      type: String,
    }, sanctionLetter :{
        type: String,
    
      },
      insurancePolicy :{
        type: String,
    
      },
      rc :{
        type: String,
    
      },
      runningCarLoanDetail: {
        // runningCarLoan: {
        //   type: String,
        //   // required: true,
        //   enum: ['yes', 'no']
        // },
        option: {
          type: String,
          // required: true,
          enum: ['yes', 'no']
        },
        sanctionLetter :{
          type: String,
      
        }
      },
};
const statusScehma =new mongoose.Schema({
  loanStatus :{
    type: String,
  },
  disburstAmount : {
    type : Number
  },
  reason : {
    type : String
  },
  bank : {
    type : String
  },
  reuploadDocs :{
    type : [String],
    enum : [ 'panCard','aadharfront',' aadharback','payslip1' ,'payslip2',
      'payslip3','sevenMonthStatement',	'form16' , 'form26', 'closerLetter1', 
      'closerLetter2','closerLetter3','propertyChain' ,'map', 'gstMsmeCerificate',
      'itrComution1','itrComution2', 'itrComution3','oneBankStatementCurrentAccount' ,'oneYearSavingAccountStatement', 'sanctionLetter' ,'insurancePolicy','rc',]
  }, 
   changeStatus:
     { type: String, default: dayjs(Date.now()).format('DD MMM YYYY') },
},{timestamps:true}
)
const detailsScehma = new Schema({  personalDetail :{
    type : personalDetailSchema,
    
  },
  carDetail:{
    type : carDetailSchema
  },
  professionalDetail :
  {
      type : professionalDetailSchema,
  }
  ,
  // runningLoan :{
  //     type : runningloanSchema,
  // },
  runningLoan: {
    option: {
      type: String,
      required: true,
      enum: ['yes', 'no']
    },
    loans: [RunningLoanDetailsSchema]
  },
  propertyDetail:{
    type : propertyDetailSchema,
  },
  businessprofessionalDetailSchema :{
    type : businessprofessionalDetailSchema,
  },
  document :
  {
      type :UserDocsData ,
      required : true
  },
  })
  const  basicInfoSchema ={
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true    },
   
    // mobile: MobileNumberValidator,
    mobile: {
      type: Number,
      required: true},
  
      qualification :{
        type : String,
        // required : true
      },
   
  company :{
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
    address: {
      type: String,
      required: true,
    },
    referral:{
      type : String
    },
    experience :{
    type : Boolean
  }}
const loanSchema = new Schema(
  {   
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'vendor', required: true },
    vendorInfo :{
      type : basicInfoSchema
    },
    applicationID :{
      type : String
    },
    type :  {
        type: String,
        enum: ['personal loan', 'home loan', 'loan against property','loan against property bt',
          'used car loan','business loan','used car loan bt',
         'home loan balance transfer','personal loan balance transfer'],
        required: true,
       
      },
      details :{
       type : detailsScehma,
       required : true
         
        },
      
      status: { type: statusScehma, 
        default: { loanStatus :'pending',
       
        reason :"Your application will be reviewed"}},
        disbursedDate :{
          type: String
        },payOut :{
          type : String

        },
     paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
       utrNo :{type: String,default : " "},
       uploadInvoice :{type: String,default : " "},
       downLoadInvoice :{type: String,default : " "},
       paidDate :{
        type: String,
       },
       movedTo :{
        type: String,
       },
       role:{
          type: String,
       },
       movedBy :{
        type: String,
       },
       rate :{type: String,},
     createdLoan:
     { type: String, default: dayjs(Date.now()).format('DD MMM YYYY') },
     updatedAt: { type: Date, default: Date.now },
            
  },{ timestamps: true} 
);


loanSchema.index({ createdAt: 1 ,type : 1});
module.exports=  mongoose.model("loan",loanSchema);


