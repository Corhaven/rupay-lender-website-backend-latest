
const mongoose = require("mongoose");
const { Schema } = mongoose;
// const currentMonthAndYearInString = () => {
//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   // Create a new Date object and convert to IST
//   const today = new Date();
//   const options = { timeZone: "Asia/Kolkata" }; // IST time zone

//   const istDate = new Date(today.toLocaleString("en-US", options));

//   const formattedDate = `${istDate.getDate()} ${ 
//     monthNames[istDate.getMonth()]
//   } ${istDate.getFullYear()}`;

//   return formattedDate;
// };
const paymentSchema = new Schema(
  {   
    // vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'vendor', required: true },
    username: {
        type: String,
        required: true,
      },
    
      mobile: {
        type: Number,
        required: true
       },
        referral:{
            type : String,
            required : true
        },
        type :  {
        type: String,
        enum: ['personal loan', 'home loan', 'loan against property','business loan',
         'home loan balance transfer','personal loan balance transfer'],
        required: true,
      },
      amount :{
        type : Number,
            required : true },
      transactionDate :{
        type : Date,
        required : true
      },
      transactionId :{
        type : String,
        required : true
      }
,
mode :{
    type : String,
    required : true 
},
  
    //  paymentStatus: { type: String, enum: ['received', 'not received'], default: 'not received' },
    //  transactionDate:
    //  { type: String, default: currentMonthAndYearInString() },
     createdAt: { type: Date, default: Date.now },
     updatedAt: { type: Date, default: Date.now },
            
  },{ timestamps: true} 
);
paymentSchema.index({mobile:1})
module.exports =  mongoose.model("payment",paymentSchema);


