const { sendEmail } = require("../helpers/nodemailer");
const { generateLoanId } = require("../helpers/otp");
const subVenderModel = require("../models/subVenderModel");
const venderModel = require("../models/venderModel");
// const walletRouter = require("../wallet");
const jwt = require("jsonwebtoken");

const createSubVendor = async(req,res)=>{
    try {
        // console.log(req.vendor)
 const {username,email,mobile,state,city,pinCode,address,whatsUppOpt,payOut}   = req.body
   const exisitingUser = await subVenderModel.findOne(
       {
         $or: [
           { 'basicInfo.email': email },
           { 'basicInfo.mobile': mobile }
         ]
       })    
     if (exisitingUser) {
       return res.status(200).send({
         success: false,
         message: "already Register please login",
       });
     }
    const vendor = await venderModel.findById({_id:req.vendor._id}).select('walletBalance')
    // console.log(vendor)
     if(vendor.walletBalance < 1000){
        return res.status(500).send({
            success: false,
            message: "Not enough wallet balance",
          });
     }
     const venderID = `SV${generateLoanId()}` 

     await venderModel.findByIdAndUpdate({_id :req.vendor._id},{walletBalance:vendor.walletBalance-1000},{new : true})
 const subVendor = new subVenderModel({basicInfo:{username,email,mobile,state,city,pinCode,address,referral:req.vendor.venderID},whatsUppOpt,payOut,venderID})
 await subVendor.save();
 
 if(subVendor.length !== 0){
    const recipients = [     
        {email: "corhaven.india@gmail.com"}
    ]; 
      const subject = "New Sub vendor created"
            const message = `We are excited to inform you that a new vendor has successfully signed up on the Rupay Lender platform. Below are the details of the new vendor:
      
       Vendor Details:
       - Referral : ${req.vendor.venderID ? req.vendor.venderID : " "}
       - Vendor Name : ${req.vendor.basicInfo.username}
       - Sub Vendor Name: ${username ? username : " "}
       - Mobile Number: ${mobile ? mobile : " "}`
  
      const htmlMessage = `<p>Dear Admin,</p>
                 <p>We are excited to inform you that a new vendor has successfully signed up on the Rupay Lender platform. Below are the details of the new vendor:</p>
                 <p><strong>Vendor Details:</strong></p>
                 <ul>
                     <li><strong>Referral:</strong> ${req.vendor.venderID ? req.vendor.venderID : " "}</li>
                     <li><strong>Vendor Name:</strong>${req.vendor.basicInfo.username}</li>
                     <li><strong>Mobile Number:</strong> ${mobile ? mobile : " "}</li>
                     <li><strong>Sub Vendor Name:</strong> ${username ? username : " "}</li>
                 </ul>`
       await sendEmail(subject,htmlMessage,message,recipients)
     return res.status(200).send({success:true, message : "New Sub vendor created",subVendor});
 }
else{
    return res.status(500).send({success:true, message : "Error Occured"});
}
} catch (error) {
    return res.status(500).send({success:true, message : error.message});
}
}
    const verifyOtp = async(req,res)=>{
          const { OTP } = req.body;
          const {mobile,otp,otpExpires} = req.otp;
     
          if (otp === OTP && Date.now() < otpExpires) {
      
              const subVendor = await subVenderModel.findOne({'basicInfo.mobile':mobile})
              // console.log(subVendor)
              if(subVendor.length === 0 ){
                  return res.status(500).send({success : false , message : "You are not registered"})
              }
              const role = "subVendor" 
              const payload  = {_id : subVendor._id,basicInfo : subVendor.basicInfo,role,venderID : subVendor.venderID}
           
          const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });
          subVendor.token = accessToken
              await subVendor.save();
              res.status(200).send({success: true, message: 'Logged in successfully',accessToken,role});

          } else {
            res.status(500).send({ success: false, message: "Invalid or expired OTP" });
          } 
      }
module.exports = {createSubVendor,verifyOtp}