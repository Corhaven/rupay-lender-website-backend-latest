const dayjs = require("dayjs")
const { required } = require("joi")
const mongoose = require("mongoose")

const userDocs = {
    panCard: {
        type: String,
      },
      aadhaarCard: {
        type: String,
      },
}

const msmeSchema  = new mongoose.Schema({
    
name :{
        type : String,
        required : true
    },
    companyName :{
        type : String,
        required : true
    },
    company:{
        type : String,
        required : true
    },
    pinCode : {
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
    amount : {
        type : Number,
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
  userDocs : userDocs,
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

module.exports = mongoose.model('msmeModel',msmeSchema)




    