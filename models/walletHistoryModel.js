// import dayjs from "dayjs";

// models/WalletHistory.js
const dayjs = require("dayjs");
const  mongoose  = require("mongoose");

const walletHistorySchema = new mongoose.Schema({
  vendorMongooseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },  
   vendorId :{
    type:String,
    required:true
},
  type: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  balanceAfterTransaction: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  
  txnDate: {
    type: String,
    default: dayjs(Date.now()).format("DD-MMM-YYYY"),
  },
 
},  { timestamps: true });

module.exports= mongoose.model("walletHistoryModel", walletHistorySchema);
