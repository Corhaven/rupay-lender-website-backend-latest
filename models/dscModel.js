const dayjs = require("dayjs")
const { default: mongoose } = require("mongoose")
const userDocs = {
    proofOfIdentity:{
        type : String,
    },
    proofOfAddress:{
        type : String,
    },
    attestationOfficerProof: {
        type : String,
    },
}
const dscSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    dateOfBirth :{
    type : String,
    required : true
  },
  
  gender :{
        type : String,
        required : true
    },
    city :{
        type : String,
        required : true
    },   applicationID : {
        type: String,
        required: true
    },
        
    pinCode :{
        type : Number,
        required : true 
    },
    state : {
        type : String,
        required : true
    },
    residentialAddress : {
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
    amount : {
        type : Number,
        required : true
    },
    userDocs:userDocs,
    status :{
        type:String,
        default:"In-Process"
       },  payout:{
        type: Number,
    },    paidDate :{type: String},
        
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

module.exports = mongoose.model('dscModel',dscSchema)