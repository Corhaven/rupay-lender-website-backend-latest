const subAdmModel = require("../models/subAdmModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const venderModel = require("../models/venderModel");
const loanModel = require("../models/loanModel");
const { generateLoanId, generateOTP } = require("../helpers/otp");
const { leadTextMessage, leadHtmlMessage, leadSubject, movedleadSubject, movedleadTextMessage, movedleadHtmlMessage } = require("../helpers/messageMail");
const { sendEmail } = require("../helpers/nodemailer");
const bankmodel = require("../models/bankmodel");
const companyModel = require("../models/companyModel");
const bankerListmodel = require("../models/bankerListmodel");
const { sendOtpEmail } = require("../helpers/otpMail");
const wfhmodel = require("../carrier/model/wfhmodel");
// const loanModel = require("../models/loanModel");

  const login = async (req, res) => {
    try {
      const { email } = req.body;
    console.log(email)
      const subAdmin = await subAdmModel.findOne({ email });
      console.log(subAdmin?.active)
      if(!subAdmin?.active) return res.status(201).send({success : false, message:"You are inactive"})
      if(!subAdmin.length == 0) return res.status(201).send({success : false, message:"Wrong Email"})
     const otp = generateOTP();
 
    const otpExpires = Date.now() + 300000; 
    const payload = {
        email, otp , otpExpires
    }
     const emailOtpToken = jwt.sign(payload, process.env.OTPSECRET, { expiresIn: '1h' });
 await sendOtpEmail(email,otp) 
  res.status(200).send({success : true,message :"send otp on email",emailOtpToken})
      // const token = jwt.sign({ id: subAdmin._id, username: subAdmin.username, role: subAdmin.role,department : subAdmin.department,permissions : subAdmin.permissions ,referral : subAdmin.referral,referralLink:subAdmin.referralLink}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      // res.status(200).send({success:true ,token,department:subAdmin.department,role: subAdmin.role,permissions : subAdmin.permissions,message:"success" });
    }catch(error){
      res.status(500).send({success:false, message: error.message });
    }
  };
  const verifyEmail = async(req,res)=>{
    try {
        const { OTP } = req.body;
    const {email,otp,otpExpires} = req.otp;
    // console.log(otp,OTP, "wdef", otp === OTP)
    // console.log(Date.now() < otpExpires,otpExpires)
    if (otp === OTP && Date.now() < otpExpires) {
        const subAdmin = await subAdmModel.findOne({ email });
       const token = jwt.sign({ id: subAdmin?._id, username: subAdmin?.username, role: subAdmin?.role,department : subAdmin?.department,permissions : subAdmin?.permissions ,referral : subAdmin?.referral,referralLink:subAdmin?.referralLink}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });
      res.status(200).send({success:true ,token,department:subAdmin?.department,role: subAdmin?.role,permissions : subAdmin?.permissions,message:" login successfully" });
      // res.status(200).send({ success: true, message: "Email verified" });
    } else {
      res.status(500).send({ success: false, message: "Invalid or expired OTP" });
    }  
    } catch (error) {
      
    }
  }
  const allVendors = async(req,res)=>{
    try {
        const {referral, role} = req.vendor
        
        // console.log(referral)
      
        let vendors;
        if(role == 'Franchise Manager' ){
                  vendors = await venderModel.find({}).sort({ createdAt: -1 }).lean()

        }else{
  if(!referral){
          return res.send({success:false,message : "referral is not found"})
        }
          vendors = await venderModel.find({"basicInfo.referral": referral}).sort({ createdAt: -1 }).lean()
        }
       if(!vendors){
        return res.status(500).send({success : false,message :"vendors not found"})
       }
      //  console.log(vendors)
       res.status(200).send({success : true,message : "vendors fetch success",vendors})
    }catch(err){
      return res.status(500).send({success : false,message : err.message})
  
    }
  }
  const getmangerLoans = async(req,res)=>{
    try {
        const referral = req.vendor.referral
    const {loanType} = req.params 
   const loan = loanType.split("-").join(' ')
        // console.log(loan)
  let loans;
        if(req.vendor.role ==='manager'){
          const vendors = await venderModel.find({"basicInfo.referral": referral});
          if(!vendors){
            return res.status(500).send({success : false,message :"vendors not found"})
          }
          //    console.log(vendors)
          const vendorIds = vendors.map(vendor => vendor._id);
          
           loans = await loanModel.find({ vendorId: { $in: vendorIds },type: { $in: loan } }).sort({ createdAt : -1});
        }else{
           loans = await loanModel.find({ type: loan });

        }
          if(!loans){
            return res.status(500).send({success : false,message : "loans not found"})
          }
          
       res.status(200).send({success : true,message : "loans fetch success",loans})
    }catch(err){
      res.status(500).send({success : false,message : err.message})
  
    }
  }
  const searchLoanController = async (req, res) => {
    try {
      const { keyword } = req.params;
      const referral = req.vendor.referral
      const resutls = await loanModel
        .find(
          {
            $and: [
              { referral: referral }, // Filter by referral
              {
                $or: [
                  { ['status.loanStatus']: { $regex: keyword, $options: "i" } },
                  { ['vendorInfo.username']: { $regex: keyword, $options: "i" } },
                ],
              },
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
  const commisionRate = async(req,res)=>{
    try {
      const {bank,loanType,rate} = req.body
      // console.log(commisionRate)
      const {vendorId} = req.params
   
    rate.push(commisionRate)
      
 await venderModel.findByIdAndUpdate(vendorId, { $set: rate }, { new: true });
  //  console.log(vendor)
    res.status(200).send({success: true,message : "commision rate added"})
    } catch (error) {
      console.log(error.message)
      res.status(500).send({success: false,message : "Not added"})

    }
  }
const getvendorController = async(req,res)=>{
  try{
  const { mobile } = req.body
  console.log(mobile)
      const vendor = await venderModel.find({'basicInfo.mobile' : mobile}).select("venderID basicInfo.username basicInfo.mobile basicInfo.state basicInfo.city basicInfo.referral").lean();
  console.log(vendor)
      if (!vendor || vendor?.length === 0) {
        return res.status(500).send({success:false, message:" vendor not found"});
      }
  
     res.status(200).send({success:true,message:"loan send",vendor})
}catch(err){
  console.log(err.message)
  res.status(500).send({success : true,message : err.message})
}
}
const getBanks= async (req, res) => {
  const { pincode, type } = req.query;
  if (!pincode || !type) {
    return res.status(400).json({ message: 'Please provide pincode and product parameters' });
  }
  try {
    const results = await bankmodel.find({
      pincode: pincode,
      products: { $regex: type, $options: 'i' } // Case-insensitive match
    }).select('bankName');
    if (results.length === 0) {
      return res.status(404).send({success : false , message : "No records founds"});
    }
    res.status(200).send({success : true , results});
  } catch (error) {
    console.error('Error searching records:', error);
    res.status(500).send({success : false,message : error.message});
}};
const movedTo = async(req,res)=>{
  try {

  const {movedTo} = req.body;
  const {id} = req.params
  const recipients = [
    { email:"corhaven.india@gmail.com"},
  ];
 
  const loan = await loanModel.findByIdAndUpdate(id, { $set: {movedTo:movedTo,movedBy:req.vendor.username} }, // Partial update
    { new: true})
    // console.log(loan)
 
      const subAdm = await subAdmModel.find({username : movedTo})
    
subAdm.forEach(subAdm => {
  if (subAdm?.email) {
      recipients.push({ email: subAdm.email });
  }
});
// }
    
const text =await movedleadTextMessage(loan?.applicationID,loan?.details?.personalDetail?.username,loan?.type,req.vendor.username)
const html =await movedleadHtmlMessage(loan?.applicationID,loan?.details.personalDetail.username,loan?.type,req.vendor.username)
// console.log(recipients)
await sendEmail(movedleadSubject,html,text,recipients)
    res.status(200).send({success : true , message : `Move to ${movedTo}`,loan})
  } catch (error) {
    res.status(500).send({success : false , message : error.message})
  }
}
  const getMovedData = async(req,res)=>{
    try {

    // console.log(req.vendor)
    const loan  = await loanModel.find({movedTo : req.vendor.username})
    // console.log(loan)
    if(loan.length == 0){
     return res.status(201).send({success : false, message :  "No Moved data found"})
    }
    res.status(200).send({success : true , message : "Moved data",loan})
  } catch (error) {
      res.status(500).send({success : false , message : error.message})
  }
  }
  const getmanager = async(req,res)=>{
    try {
    const subAdmin = await subAdmModel.find({role : "manager"}).select('username')
    if(subAdmin.length == 0){
      return res.status(201).send({success : false, message :  "No subAdmin  found"})
     }
     res.status(200).send({success : true , message : "subAdmin",subAdmin})

  } catch (error) {
    res.status(500).send({success : false , message : error.message})
  }
  }
  const getGrade = async(req,res)=>{
    try {
  
    const {companyName} = req.params;
    // console.log(companyName)
    const grade = await companyModel.find({companyName}).select('companyCategory')
    if(grade.length === 0){
      return res.status(500).send({success : false, message : "No catagory found on this company"})
    }
    res.status(200).send({success : true, message : "catagory found on this company",grade})
  } catch (error) {
    res.status(500).send({success : false, message : error.message})
  }
  }
  const getBankerList= async (req, res) => {
    const { pincode, type } = req.query;
    if (!pincode || !type) {
      return res.status(400).send({ message: 'Please provide pincode and product parameters' });
    }
    try {
      const results = await bankerListmodel.find({
        pincode: pincode,
        products: { $regex: type, $options: 'i' } // Case-insensitive match
      })
      if (results.length === 0) {
        return res.status(404).send({success : false , message : "No records founds"});
      }
      res.status(200).send({success : true , results});
    } catch (error) {
      console.error('Error searching records:', error);
      res.status(500).send({success : false,message : error.message});
  }};
  const getpendings = async(req,res)=>{
    try {
      // console.log(req.vendor)
      let totalPending;
      if(req.vendor.role === "admin"){
         totalPending = await loanModel.find({'status.loanStatus':"pending"}).countDocuments()
      }else{
         totalPending = await loanModel.find({'vendorInfo.referral':req.vendor.referral,'status.loanStatus':"pending"}).countDocuments()
      }
      return res.status(200).send({success : true , totalPending});
    } catch (error) {
      res.status(500).send({success : false,message : error.message});

    }
  }
  const getRework = async(req,res)=>{
    try {
      let totalrework;
      if(req.vendor.role === "admin"){
        totalrework = await loanModel.find({'status.loanStatus':"Rework"}).countDocuments()
      }else{
        totalrework= await loanModel.find({'vendorInfo.referral':req.vendor.referral,'status.loanStatus':"Rework"}).countDocuments()
      }
      // const totalrework= await loanModel.find({'vendorInfo.referral':req.vendor.referral,'status.loanStatus':"Rework"}).countDocuments()

      return res.status(200).send({success : true,totalrework});
    } catch (error) {
      res.status(500).send({success : false,message : error.message});
    }
  }

  const updateRemarks = async(req,res)=>{
    try {
      const {remarks} = req.body;
      const {id} = req.params;
      // console.log(remarks,id)
      if(!remarks || !id){
        return res.status(400).send({success : false,message : "Please provide remarks and id"})
      }
      const loan = await venderModel.findByIdAndUpdate(id, { $set: {remarks:remarks} }, // Partial update
        { new: true})
        // console.log(loan)
        if(!loan){
          return res.status(500).send({success : false,message : "Loan not found"})
        }
        res.status(200).send({success : true , message : "Remarks updated"})
    } catch (error) {
      res.status(500).send({success : false , message : error.message})
    }
  }
   const getTelecallerLead = async (req, res) => {
  try {
    console.log("Fetching telecaller leads...");

    const referralLink = req.vendor.referralLink
    let referral;

if (referralLink) {
  const url = new URL(referralLink);
  referral = url.searchParams.get("referral");
}
    console.log(referral)
    
 const filter = {
      role: "telecaller",
      "vendorInfo.referral": referral, // dot notation for nested field
    };
    const loans = await loanModel.find(filter);

    return res.status(200).send({
      success: true,
      message: "Telecaller leads fetched successfully",
      loans,
    });
  } catch (error) {
    console.error("Error fetching telecaller leads:", error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
 const getTelecallers = async (req, res) => {
  try {
    console.log("Fetching telecaller leads...");

    const referralLink = req.vendor.referralLink
    let referral;

if (referralLink) {
  const url = new URL(referralLink);
  referral = url.searchParams.get("referral");
}
    console.log(referral)
    
 const filter = {
      role: "telecaller",
      referral: referral, // dot notation for nested field
    };
    const telecallers = await wfhmodel.find(filter);

    return res.status(200).send({
      success: true,
      message: "Telecaller fetched successfully",
      telecallers,
    });
  } catch (error) {
    console.error("Error fetching telecaller leads:", error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
  module.exports = {getTelecallers,getTelecallerLead,updateRemarks,verifyEmail,getRework,getpendings,getBankerList,getmanager,getGrade,getMovedData,movedTo,getBanks,getvendorController,login,allVendors,getmangerLoans,searchLoanController,commisionRate}