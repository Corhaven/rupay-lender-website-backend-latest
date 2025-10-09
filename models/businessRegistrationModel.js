const { default: mongoose } = require("mongoose")
// import dayjs from "dayjs";
const dayjs = require("dayjs")
const userDocs = {
    addressProof:{
        type : String,
    },
    passport:{
        type : String,
    },
    panCard: {
        type : String,
    },
    aadhaarCard: {
        type : String,
    },
    digitalSignatureCertificate:{
        type : String,
    },
    directorIdentificationNumber:{
        type : String,
    },
    registeredOfficeProof:{
        type : String,
    },
    declaration:{
        type : String,
    },
    memorandumOfAssociation:{
        type : String,
    },
    articlesOfAssociation:{
        type : String,
    },
}
const businessRegistrationSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
  company :{
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
    business : {
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
    },   applicationID : {
        type: String,
        required: true
    },
        
    amount : {
        type : Number,
        required : true
    },
   userDocs :userDocs,
   status :{
    type:String,
    default:"In-Process"
   },  
   payout:{
    type: Number,
},  
  paidDate :{type: String},
    
// paiddate

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

})

module.exports = mongoose.model('businessRegistrationModel',businessRegistrationSchema)