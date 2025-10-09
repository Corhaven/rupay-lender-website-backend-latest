// const { date } = require("joi")
const dayjs = require("dayjs")
const { default: mongoose } = require("mongoose")

const userDocs = {
    identityProof : {
    type : String,
},

addressProof : {
type : String,
},

ageProof: {
type : String,
},
previouslyIssuedPAN :{
    type : String,
},
}
const duplicatePanSchema = new mongoose.Schema({

name :{
    type : String,
    required : true
},
dateOfBirth:{
    type: Date,
    required : true

},
gender :{
    type : String,
    required : true
},
residentialAddress :{
    type : String,
    required : true 

},
email:{
    type : String,
    required : true

}, 
 

mobile :{
    type : Number,
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
    choosePan :{
        type : String,
    },
   
    userDocs:userDocs,
    status :{
        type:String,
        default:"In-Process"
       },   payout:{
        type: Number,
    },    paidDate :{type: String},
        
    amount : {
        type : Number,
        required : true
    },
     vendorMongooseId:{
            type: mongoose.Schema.Types.ObjectId, ref: 'vendor', required: true 
        },
        vendorId :{
            type:String,
            required:true
        },   applicationID : {
            type: String,
            required: true
        },
            
        createdAt:{
            type:String,
            default:dayjs(Date.now()).format("MMM D, YYYY h:mm A")
        }
   
})

module.exports = mongoose.model('duplicatePanModel',duplicatePanSchema)