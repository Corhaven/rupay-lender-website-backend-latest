const mongoose = require("mongoose");


const bankSchema = new mongoose.Schema({
    pincode :{
        type : Number
    },
    bankName : {
        type : String
    },
    products :{
        type : [String]

    }

})
bankSchema.index({ pincode: 1});
module.exports = mongoose.model("bank",bankSchema)