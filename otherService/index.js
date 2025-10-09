const express  = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const { default: mongoose } = require("mongoose");
// const upload = require("../helpers/multer");
const { generateLoanId } = require("../helpers/otp");
const applyVisaModel = require("../models/applyVisaModel");
const updateWalletAndLogHistory = require("../helpers/walletUpdate");
const { uploadB2bLeads } = require("../helpers/multervendor");
// const applyVisa = require("../models/applyVisa");
// const applyVisaModel = require("../models/applyVisaModel")
// const upload = require("../helpers/multer")
const otherServiceRouter = express.Router()

const cpUpload = uploadB2bLeads.fields([
  { name: 'passportPhoto', maxCount: 1 },
  { name: 'passport', maxCount: 1 },
]);

otherServiceRouter.post('/apply-Visa', cpUpload,authMiddleware, async (req, res) => {
  try {
  
    const applicationID = `OS${generateLoanId()}`
        
    const vendorId = req.vendor.venderID
    const vendorMongooseId= req.vendor._id

    const referral = req.vendor.basicInfo.referral
    const passportPhotoUrl = req.files.passportPhoto[0].location;
    const passportUrl = req.files.passport[0].location;
    // console.log(req.body)
            // const vendorId = req.vendor?._id
            const amount = req.body.amount
            await updateWalletAndLogHistory({
              vendorMongooseId,vendorId,
            amount,
            type: "debit",
            description: "Apply Visa Service Payment",
          });
    const newUser = new applyVisaModel({
   ...req.body,
      passportPhotoUrl,
      passportUrl,
      applicationID,vendorId,vendorMongooseId,referral
    });
    
    await newUser.save();

    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

otherServiceRouter.get('/:service',authMiddleware,async(req,res)=>{
    try {
      // console.log('ed')
      // console.log(req.params)
      const {service} = req.params
      const modelName = `${service.replace(/-/g, '')}Model`;
  
         const Model = mongoose.model(modelName);
      const id = req.vendor.venderID
      const product = await Model.find({vendorId : id}).select('applicationID createdAt paidDate payout name mobile amount status ')
      // console.log(product)
      res.status(200).send({success:true,product})
    } catch (error) {
      res.status(500).send({
          success: false,
          message: error.message,
    })
  }
   })
module.exports = otherServiceRouter



