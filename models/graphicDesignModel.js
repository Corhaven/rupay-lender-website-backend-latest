const dayjs = require("dayjs");
const mongoose = require("mongoose");

const graphicDesignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    projectType: {
        type: String,
        required: true, // e.g., Logo Design, Branding, Illustration, etc.
    },
    description: {
        type: String,
        required: true,
    },
    state : {
        type : String,
    },
    city :{
        type : String,
    },
    presentAddress : {
        type : String,
    },
    pinCode : {
        type : Number,
    },
    referenceFiles: {
        type: [String], // Array to store paths to uploaded reference files

        
    }, 
      status :{
         type:String,
         default:"In-Process"
        }, applicationID :{
            type : String,
        },
        amount :{
            type : String,
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
  
});

module.exports = mongoose.model('graphicDesignModel', graphicDesignSchema);
