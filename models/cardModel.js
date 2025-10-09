const { default: mongoose } = require("mongoose");
// const { currentMonthAndYearInString } = require("../helpers/hashpassword");
const dayjs = require("dayjs");


const cardSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'vendor', required: true },
    referral :{
        type : String
    },
    username:  {
        type : String,
        required : true
    },
    mobile :{
        type : Number,
        required : true
    },
    profession : {
        type : String,
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
    email: {
        type : String,
    },
  
    company:  {
        type : String,
    },
    companyName : {
        type : String,
    },
    companyAddress : {
        type : String,
    },
    companyState :{
        type : String,
    },
    companyCity :{
        type : String,
    },
    companyPinCode : {
        type : Number,
    },
    officeEmail: {
        type : String,
    },
    monthlyNetCreditSalary : {
        type : Number,
    },
    salaryBankAccount :{
        type : String,
    },
    cardName : {
        type : String,
        required : true
    },
    pan_no :{
        type : String,
        required : true

    },
    status :{
        type : String,
        default : "In-progress"
    },
    applicationID :{
        type : String,
    },

      createdCard:
      { type: String, default: dayjs(Date.now()).format('DD MMM YYYY') },
      paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
      utrNo :{type: String,default : " "},
      uploadInvoice :{type: String,default : " "},
      paidDate :{type: String},
      approvedDate : {
        type: String
      },
    // paiddate
      payOut :{type: String,default : " "}
},{timestamps:true})

module.exports = mongoose.model('cardModel',cardSchema)