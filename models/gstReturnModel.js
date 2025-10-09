const dayjs = require("dayjs")
const { required } = require("joi")
const { default: mongoose } = require("mongoose")

const gstReturnSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
  company :{
    type : String,
    required : true
  },
  gstReturnType :{
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
    },  status :{
        type:String,
        default:"In-Process"
       },
       payout:{
        type: Number,
    },    paidDate :{type: String},
        
    email :{
        type : String,
        required : true
    },
    vendorMongooseId:{
        type: mongoose.Schema.Types.ObjectId, ref: 'vendor', required: true 
    },
    vendorId :{
        type:String,
        required:true
    },
    mobile : {
        type : Number,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    applicationID : {
        type: String,
        required: true
    },
        
    createdAt:{
        type:String,
        default:dayjs(Date.now()).format("MMM D, YYYY h:mm A")
    }
   
})

module.exports = mongoose.model('gstReturnModel',gstReturnSchema)