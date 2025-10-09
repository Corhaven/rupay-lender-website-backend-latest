const { default: mongoose } = require("mongoose")

const createCardSchema = new mongoose.Schema({
bankName :{
    type : String
 }
 ,cardName :{
    type : String
 }
 ,
fee :{
    type : Number
 }
 ,
 image :{
    type : String
 },
 link :{
    type : String
 },

  tags: [String],                                      // Cashback, Premium, Lifetime Free
  benefits
: [String], 
})

module.exports = mongoose.model('craeteCardModel',createCardSchema)