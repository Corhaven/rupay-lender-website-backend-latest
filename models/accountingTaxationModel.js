const dayjs = require("dayjs")
const mongoose = require("mongoose")

const accountingTaxationScehma =new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pinCode: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    panNumber: {
        type: String,
        required: true
    },
    query: {
        type: String,
        required: true
    },
   applicationID : {
        type: String,
        required: true
    },
    status :{
     type:String,
     default:"In-Process"
    },
    payout:{
        type: Number,
    },    
    paidDate :{type: String},
        
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
module.exports = mongoose.model("accountingTaxation",accountingTaxationScehma)