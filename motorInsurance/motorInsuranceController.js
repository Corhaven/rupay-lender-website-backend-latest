const motorInsuranceModel = require("../models/motorInsuranceModel");

const motorInsurance = async(req,res)=>{
    try{
    const vendorId = req.vendor?._id
    const vendorInfo = req.vendor?.basicInfo
 
   const motorInsurance = new motorInsuranceModel({
    ...req.body,
    vendorId,
  rc: req.files.rc ? req.files.rc[0].location : '',
    aadhar: req.files.aadhar ? req.files.aadhar[0].location : '',
    insurancePolicy: req.files.insurancePolicy ? req.files.insurancePolicy[0].location : '',
   })
   await motorInsurance.save();
   res.status(201).send({success : true , message : "registration success",motorInsurance})
} catch (error) {
    res.status(400).send({success : false , message : error.message})
}
}

module.exports = {motorInsurance}