const dayjs = require("dayjs")
const { default: mongoose } = require("mongoose")

const userDocs ={
     photo:{
    type : String,
},
pan:{
    type : String,
},
certificateOfRegistration: {
    type : String,
},
addressProof: {
    type : String,
},
logo: {
    type : String,
},}

const trademarkSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
  company :{
    type : String,
    required : true
  },
 trademarkName  :{
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
    companyName : {
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
    amount : {
        type : Number,
        required : true
    },
 
   userDocs:userDocs,
     vendorMongooseId:{
            type: mongoose.Schema.Types.ObjectId, ref: 'vendor', required: true 
        },
        vendorId :{
            type:String,
            required:true
        },
        status :{
            type:String,
            default:"In-Process"
           },
           payout:{
            type: Number,
        }, 
           paidDate :{type: String},
            
           applicationID : {
            type: String,
            required: true
        },
            
        createdAt:{
            type:String,
            default:dayjs(Date.now()).format("MMM D, YYYY h:mm A")
        }
  
})

module.exports = mongoose.model('trademarkModel',trademarkSchema)