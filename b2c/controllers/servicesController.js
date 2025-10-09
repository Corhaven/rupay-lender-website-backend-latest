const { sendSms } = require("../../helpers/message");
const b2cStatusHistoryModel = require("../model/b2cStatusHistoryModel");
const Customer = require("../model/customerModel");
// const b2cStatusHistory = require("../model/b2cStatusHistoryModel")


const loanInquiryModel = require("../model/loanInquiryModel")
     const loanTypes = [
  'personal loan',
  'home loan',
  'loan against property',
  'loan against property bt',
  'used car loan',
  'used car loan bt',
  'business loan',
  'home loan balance transfer',
  'personal loan balance transfer',
  'professional loan'
];
const getServices = async(req,res)=>{
    try {
      let {type} = req.params
      let inquires ;
      if(type == "all-loans"){
 inquires = await loanInquiryModel.find({
  type: { $in: loanTypes }
}).sort({ createdAt: -1 });


      }else{
      type = type.replace(/-/g, ' ')
// console.log(type)
        inquires  = await loanInquiryModel.find({type}).sort({createdAt :-1})
      }
// console.log(inquires)
       if(!inquires)
         { 
           return res.status(404).send({success : false , message : "No inquires found"})
         }
         res.status(200).send({success : true , message : "inquires successfully fetch",inquires})
         
       } catch (error) {
         return res.status(404).send({success : false , message :error.message})
       
       } 
  }

  const updateStatus = async (req, res) => {
    try {
     
  const {status } = req.body;

  if (!status) return res.status(400).send('Status is required');
//   let updateFields = { 'status.loanStatus': loanStatus  };

  
  
  const updatedStatus = await loanInquiryModel.findByIdAndUpdate(
      req.params.inquiryId,
      { $set: {status} },
      // {updateFields},
      { new: true }
  );
  // console.log()
     const { _id,applicationID, username, mobile, type } = updatedStatus;
     const statusHistory = new b2cStatusHistoryModel({inquiryId:_id,  applicationID, username, mobile, status, type
})
await statusHistory.save() 
const message= `Dear Customer, the status of your application ${applicationID} with Rupay Lender has been updated. Please log in to view the latest update: https://rupaylender.com/login`
await sendSms(message,mobile)
  res.status(200).send({success:true,message:"status change",updatedStatus,statusHistory})
} catch (error) {
  console.log(error.message)    
}
};
const getStatusHistory = async(req,res)=>{
  try { 
  const {mobile} = req.params;
  // console.log(mobile)
  const statusHistory = await b2cStatusHistoryModel.find({mobile})
 if(!statusHistory){
  res.status(500).send({success : false,message:"status History not found"})
 }
 res.status(200).send({success : true,statusHistory})

} catch (error) {
  res.status(500).send({success : false,message:error.message})
  
}
  
}
const getCustomerInquiries = async(req,res)=>{
  try { 
  const {mobile} = req.params;
  // console.log(mobile)
  const History = await loanInquiryModel.find({mobile})
 if(!History){
  res.status(500).send({success : false,message:"status History not found"})
 }
 res.status(200).send({success : true,History})

} catch (error) {
  res.status(500).send({success : false,message:error.message})
  
}
  
}
const getReferralHistory =async(req,res)=>{
  try {
    const {referral} = req.params
    // console.log(referral)
    const referralHistory = await loanInquiryModel.find({referred : referral}).select('applicationID status type createdInquiry mobile earning  username referred')
    if(referralHistory.length == 0){
      res.status(500).send({success : true,message:"referral History not found",referralHistory})
    }
    res.status(200).send({success : true,referralHistory})
    
  } catch (error) {
    res.status(500).send({success : false,message : "No referals"})

  }
}

const getCustomerprofile = async(req,res)=>{
  try{
   const vendorId = req.vendor?._id

     const  profile = await Customer.findOne({_id : vendorId}).lean()
  
     if(!profile){
      return res.status(400).send({success : false,message : "profile not found"})
     }
     return res.status(200).send({success : true,message : "get profile ",profile})

  } catch (error) {
    return res.status(400).send({success : false,message : error.message})

  }
}
  module.exports ={getCustomerprofile,getCustomerInquiries,getServices,updateStatus,getStatusHistory,getReferralHistory}