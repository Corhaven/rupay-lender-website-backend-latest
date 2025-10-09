const dayjs = require("dayjs");
const mongoose = require("mongoose");

const CibilUserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email:   {
        type : String,
        required : true
    },
  dob:   {
        type : String,
        required : true
    },

  mobile:  {
        type : Number,
        required : true
    },
  pan:   {
        type : String,
        required : true
    },
    isVerified:{
        type : Boolean,
        // required : true 
    },
  createdAt: {
    type: String,
    default: dayjs(Date.now()).format('DD-MM-YYYY')},
  
},
{timestamps: true}
);

module.exports = mongoose.model("CibilUser", CibilUserSchema);
