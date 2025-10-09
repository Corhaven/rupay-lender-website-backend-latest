const { default: mongoose } = require("mongoose")
const { generateCardId, generateLoanId } = require("../helpers/otp")
const socialMediaModel = require("../models/socialMediaModel")
const updateWalletAndLogHistory = require("../helpers/walletUpdate")

const social = async(req,res)=>{
    try{
      // console.log()
      const applicationID = `OS${generateLoanId()}`
        
      const vendorId = req.vendor.venderID
      const vendorMongooseId= req.vendor._id
      const amount = req.body.amount
// console.log(req.body)
        // const vendorId = req.vendor?._id
        const referral = req.vendor.basicInfo.referral
        await updateWalletAndLogHistory({
          vendorMongooseId,vendorId,
        amount,
        type: "debit",
        description: "Social Media Service Payment",
      });
    const reg = new socialMediaModel({...req.body,applicationID,vendorId,vendorMongooseId,referral})
    await reg.save()
    res.status(201).send({success : true , message : "registration success",reg})
} catch (error) {
    res.status(400).send({success : false , message : error.message})
}
}

const getsocialMedia = async(req,res)=>{
    try{ 
    const getsocial = await socialMediaModel.find()
    res.status(200).send({success : true , message : " get registration success",getsocial})
} catch (error) {
    res.status(400).send({success : false , message : error.message})
}
}
const unPaidService = async(req,res)=>{
    try {
        const {service} = req.params
        
        // const modelName = `${service.replace(/-/g, '')}Model`;
        const modelName = service
  .split('-') // Split the string by hyphens into an array
  .map((word, index) => 
    index === 0 
      ? word.toLowerCase() // Keep the first word in lowercase
      : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize the rest
  )
  .join('') + 'Model';
// console.log(modelName)
    const Model =  mongoose.model(modelName);
      const product = await Model.find({'paymentStatus' : "unpaid"}).select('applicationID createdService utrNo uploadInvoice payOut paidDate')
  
    //   console.log(product)
      res.status(200).send({success:true,product})
    } catch (error) {
      res.status(500).send({  
          success: false,
          message: error.message,
    })
  }
  }


module.exports = {getsocialMedia,social,unPaidService}