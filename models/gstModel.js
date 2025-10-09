const { required } = require("joi")
const mongoose = require("mongoose")
// const { currentMonthAndYearInString } = require("../helpers/hashpassword")
const dayjs = require("dayjs")

const userDocs  ={ 
    panCard: {
    type: String,
    required : true
  },
      businessRegistration: {
    type: String,
    required : true
  },
  identity :{
      type : String,
      required : true
  },
  pic :{
      type : String,
      required : true
  },
  addressProofofPerson:{
 type : String,
 required : true
      
  },
  addressProofofBusiness :{
      type : String,
      required : true
  },
  bankAccountStatement :{
      type : String,
      required : true
  },}

const gstSchema  = new mongoose.Schema({
    iAma :{
        type : String,
        required : true
    },
    pinCode :{
        type : Number,
        required : true
    },
    city :{
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    panNumber :{
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true
    },
    mobile : {
        type : Number,
        required : true
    },
    amount:{
        type : Number,
        required : true
    },
   
    userDocs : userDocs,
        vendorMongooseId:{
              type: mongoose.Schema.Types.ObjectId, ref: 'vendor', required: true 
          },
          vendorId :{
              type:String,
              required:true
          },
      applicationID :{
        type : String,
    },
    status :{
        type : String,
        default : "In-progress"
    },
    createdAt:
      { type: String, default: dayjs(Date.now()).format("MMM D, YYYY h:mm A")},
   
      paidDate :{type: String},
    
    // paiddate
      payout :{type: String,default : " "}
},{timestamps:true})

module.exports = mongoose.model('gstModel',gstSchema)

