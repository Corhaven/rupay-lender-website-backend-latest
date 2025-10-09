const loanModel = require("../models/loanModel")
const mongoose = require("mongoose")
const venderModel = require("../models/venderModel")
// const { notifyAdmin } = require("../helpers/socket")
const statusHistoryModel = require("../models/statusHistoryModel")

// const { default: axios } = require("axios")
const { sendSms } = require("../helpers/message")
// const { currentMonthAndYearInString } = require("../helpers/hashpassword")
const subAdmModel = require("../models/subAdmModel")
const dayjs = require("dayjs")
const wfhmodel = require("../carrier/model/wfhmodel")

const getAllLoans = async(req,res)=>{
  try{
    
      const {loanType} = req.params 
     const loan = loanType.split("-").join(' ')
          // console.log(loan)
            var loans = await loanModel.find({ type: loan });
if(!loans){
  return res.status(500).send({success : false,message : " No loans found"})  
}
            res.status(200).send({success : true,message : "loans fetch success",loans})
          }

catch (error) {
  console.log(error.message)
  res.status(500).send({success : false,message : error.message})
}
}

 const getsingleLoan = async(req,res)=>{
    try {
      
        const { loanId } = req.params
    // console.log(loanId)
        const loan = await loanModel.findById(loanId).select('details status').lean();
    
        if (!loan) {
          return res.status(500).send({success:false, message:" loan not found"});
        }
    
       res.status(200).send({success:true,message:"loan send",loan})
 }catch(err){
    console.log(err.message)
    res.status(500).send({success : true,message : err.message})
 }}
  const updateStatus = async (req, res) => {
    try {
   
   const {loanId} = req.params
   const loans = await loanModel.findById(loanId)
  //  console.log(loans)
  const {loanStatus,bank,disburstAmount, reason,reuploadDocs } = req.body;
// console.log(req.body)
  if (!loanStatus) return res.status(400).send('Status is required');
  let updateFields = { 'status.loanStatus': loanStatus  };

  if (loanStatus === 'Completed') {
    // console.log(bank,disburstAmount)
      if (!bank || !disburstAmount) {
          return res.status(400).send('Bank and Disburst Amount are required when status is completed');
      }
      loans.disbursedDate  = dayjs(Date.now()).format('DD-MM-YYYY')
      // loans.paymentStatus = "paid"
      await loans.save()
      // console.log(loans)
      updateFields['status.bank'] = bank;
            updateFields['status.disburstAmount'] = disburstAmount;
            // const message = `We are pleased to inform you that your lead application Id ${loans?.applicationID}with Rupay Lender has been successfully completed. Thank you for choosing us as your financial partner. please check on- https://bit.ly/4cXvmRb`
            const message = `We are pleased to inform you that your lead application Id ${loans?.applicationID}with Rupay Lender has been successfully completed. Thank you for choosing us as your financial partner. please check on- https://rupaylender.com/login`
            // console.log("sd",message,loans?.vendorInfo?.mobile)
         await sendSms(message,loans?.vendorInfo?.mobile)
            // console.log(dataa)
            // if(dataa?.Status === 'Success'){
            //   console.log("fg")
            // }
  // } else if (loanStatus === 'process' || loanStatus === 'cancel') {
      } 
      else if (loanStatus === 'Cancel') {

// const message = `We regret to inform you that your lead application Id ${loans?.applicationID} has been canceled on rupay lender. For more information, please check in- https://bit.ly/4cXvmRb`
const message = `We regret to inform you that your lead application Id ${loans?.applicationID} has been canceled on rupay lender. For more information, please check in- https://rupaylender.com/login`

      await sendSms(message,loans?.vendorInfo?.mobile)
      if (!reason) {
          return res.status(400).send('Reason is required when status is onhold or cancel');
      }
 
      updateFields['status.reason'] = reason;
  }else  if (loanStatus === 'on-hold') {
    
    // const message =`Your lead application Id ${loans?.applicationID} is currently on hold. Please check your lead on Rupay Lender and reupload required document. For more check - https://bit.ly/4cXvmRb`
    const message = `Your lead application Id ${loans?.applicationID} is currently on hold. Please check your lead on Rupay Lender and reupload required document. For more check - https://rupaylender.com/login`
    await sendSms(message,loans?.vendorInfo?.mobile)
    if (!reuploadDocs) {

        return res.status(400).send('Select the document are required when status is on-hold');
    }
    updateFields['status.reuploadDocs'] = [...reuploadDocs];
            updateFields['status.reason'] = reason;
  }
  // console.log(updateFields)
  const loan = await loanModel.findByIdAndUpdate(
      req.params.loanId,
      { $set: updateFields },
      // {updateFields},
      { new: true }
  );
  const statusHistory = await new statusHistoryModel({
    loanId:loanId,
    loanStatus:loanStatus,
    bank:bank,    
    disburstAmount:disburstAmount,
    reuploadDocs : reuploadDocs,
    reason:reason,
    
  }).save()
  
  // res.status(200).send({success:true,message:"status change",statusHistory,loan})
    res.status(200).send({success:true,message:"status change",statusHistory})

} catch (error) {
  console.log(error.message)    
}
};
const getvendorProfileController = async(req,res)=>{
  try{
  const { vendorId } = req.params
  // console.log(loanId)
      const vendor = await venderModel.findById(vendorId);
  
      if (!vendor) {
        return res.status(500).send({success:false, message:" vendor not found"});
      }
  
     res.status(200).send({success:true,message:"loan send",vendor})
}catch(err){
  console.log(err.message)
  res.status(500).send({success : true,message : err.message})
}
}
const getTelecallerProfileController = async(req,res)=>{
  try{
  const { vendorId } = req.params
  // console.log(loanId)
      const vendor = await wfhmodel.findById(vendorId);
  
      if (!vendor) {
        return res.status(500).send({success:false, message:" vendor not found"});
      }
  
     res.status(200).send({success:true,message:"loan send",vendor})
}catch(err){
  console.log(err.message)
  res.status(500).send({success : true,message : err.message})
}
}

const getStatusHistory = async(req,res)=>{
  try {
    // const loanId = 
    const statusHistory = await statusHistoryModel.find({loanId : req.params.loanId}).lean()
    if(!statusHistory){
      return res.status(404).send({success : false,message : "status history not found"})
    }
    res.status(200).send({success : true,statusHistory})
  } catch (error) {
    console.log(error.message)
    res.status(500).send({success : false,message : error.message})  }
}

const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await loanModel
      .find(
        {
         
        $or: [
          // { ['vendorInfo.mobile']: { $regex: keyword, $options: "i" } },
          { ['status.loanStatus']: { $regex: keyword, $options: "i" } },
          { ['vendorInfo.username']: { $regex: keyword, $options: "i" } },

        ],     
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};
const getSingleServices =async(req,res)=>{
  try {
    const {id,service} = req.params
 const modelName = `${service.replace(/-/g, '')}Model`;

    const Model =  mongoose.model(modelName);
     const details  = await Model.findById({_id : id})

     if(!details)
       { 
         return res.status(404).send({success : false , message : "No details found"})
       }
       res.status(200).send({success : true , message : "details successfully fetch",details})
       
     } catch (error) {
       return res.status(404).send({success : false , message :error.message})
     
     }
}
const getServices = async(req,res)=>{
  try {
    const {service} = req.params
 const modelName = `${service.replace(/-/g, '')}Model`;

    const Model = mongoose.model(modelName);
     const details  = await Model.find()

     if(!details)
       { 
         return res.status(404).send({success : false , message : "No details found"})
       }
       res.status(200).send({success : true , message : "details successfully fetch",details})
       
     } catch (error) {
       return res.status(404).send({success : false , message :error.message})
     
     }
}
const  editLoanrate = async(req,res)=>{
  try{
  const {rate} = req.body
  const {loanId} = req.params
  const loan = await loanModel.findById({_id : loanId})
  // console.log(loan)
  const payOut = rate*0.01*(loan.status.disburstAmount)
  // console.log(payOut)
  const commision = await loanModel.findByIdAndUpdate(loanId,{$set : {rate,payOut}},{new : true})
  res.status(200).send({success:true,commision})
} catch (error) {
  res.status(500).send({  
      success: false,
      message: error.message,
})
}}
const getProfileController = async(req,res)=>{
try {
  console.log(req.vendor.id)
  const subadmin = await subAdmModel.findById({_id:req.vendor.id})
  if(!subadmin){
    return res.status(500).send({success : false,message : "subadmin not found"})
  }
  res.status(200).send({success : true, message : "subadmin profile get ",subadmin})
} catch (error) {
  console.log(error)
  res.status(500).send({success : false,message : error.message})
}
}
module.exports= {getProfileController,editLoanrate,getServices,getSingleServices,getAllLoans,searchProductController,getStatusHistory,getTelecallerProfileController,getvendorProfileController,updateStatus,getsingleLoan}
