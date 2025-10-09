const dayjs = require("dayjs");
const { default: mongoose } = require("mongoose");
// const { currentMonthAndYearInString } = require("../helpers/hashpassword");


const faqInquirySchema = new mongoose.Schema({
  
    name:  {
        type : String,
        required : true
    },
    mobile :{
        type : Number,
        required : true
    },
  
    email: {
        type : String,
          required : true
    },
message:{
        type : String,
          required : true
    },
  
      createdAt:
      { type: String, default: dayjs(Date.now()).format('DD-MM-YYYY') },
   
},{timestamps:true})

module.exports = mongoose.model('faqInquiryModel',faqInquirySchema)