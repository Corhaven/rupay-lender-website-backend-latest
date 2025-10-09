const dayjs = require("dayjs");
const { default: mongoose } = require("mongoose");
// const { currentMonthAndYearInString } = require("../helpers/hashpassword");


const cardSchema = new mongoose.Schema({
  
    username:  {
        type : String,
        required : true
    },
    mobile :{
        type : Number,
        required : true
    },
    dob:{
        type : String
    },
    employmentType : {
        type : String,
    },
    email: {
        type : String,
    },

    monthlyIncome : {
        type : Number,
    },

    pan_no :{
        type : String,
        required : true

    },
 
    applicationID :{
        type : String,
    },
    shopID :{
        type: String,
      },
      createdCard:
      { type: String, default: dayjs(Date.now()).format('DD-MM-YYYY') },
   
},{timestamps:true})

module.exports = mongoose.model('cardModel',cardSchema)