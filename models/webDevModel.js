const dayjs = require("dayjs")
const { default: mongoose } = require("mongoose")

const webDevSchema = new mongoose.Schema({
   name :{
    type : String,
    // required : true
   },
   address :{
    type : String,
    // required : true  
 },
   purpose :{
    type : String,
    // required : true  
 },
 typeOfWebsite :{
    type : String,
    // required : true 
},
    pinCode :{
        type : Number,
        // required : true
    },
    city :{
        type : String,
        // required : true
    },
    state : {
        type : String,
        // required : true
    },
 
    email :{
        type : String,
        // required : true
    },
    mobile : {
        type : Number,
        // required : true
    },
    amount : {
        type : Number,
        // required : true
    },
    applicationID :{
        type : String,
    },
    refferenceLink :{
        type : String,
        // required : true
    },   status :{
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

module.exports = mongoose.model('webDevModel',webDevSchema)
