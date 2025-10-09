const subAdmModel = require("../../models/subAdmModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Customer = require("../model/customerModel");
const login = async (req, res) => {
    try {
      const { email, password } = req.body;
    
      const subAdmin = await subAdmModel.findOne({ email });
      // console.log(subAdmin)
      if (!subAdmin || !bcrypt.compareSync(password, subAdmin.password)) {
        return res.status(401).send({ message :  "invalid login credientils" });
      }
      const token = jwt.sign({ id: subAdmin._id, username: subAdmin.username, role: subAdmin.role,department : subAdmin.department,permissions : subAdmin.permissions }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });
      // console.log(token)
      res.status(200).send({success:true ,token,department:subAdmin.department,role: subAdmin.role,permissions : subAdmin.permissions,message:"success" });
      //, admin: { id: admin._id, username: admin.username, role: admin.role }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };
  const verifyb2cOtp = async(req,res)=>{
    try{
    const { otp } = req.body;
    // const {mobile} = 
    const tempUser = req.otp;
    console.log(tempUser)
    // const {otpExpires,} = tempUser
    if (tempUser.otpExpires < Date.now()) {
     return res.status(400).send({success:false,message: "expired OTP"});
   }
 
   if (tempUser.otp != otp) {
     return res.status(400).send({success:false,message: "wrong OTP"});
   }
   if (!tempUser || tempUser.otp != otp || tempUser.otpExpires < Date.now()) {
     return res.status(400).send({success:false,message: "Invalid or expired OTP"});
   }  
   const {mobile} = tempUser
   const user = await Customer.find({mobile})
   
   if(!user 
    || user.length === 0){
    return res.status(400).send({success:false,message: "User not found"})
   }

const {referral,earning} = user[0]
 const payload ={
       role: "customer",
        mobile : user[0].mobile,
       _id: user[0]._id,
            }
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
       
   req.otp = null;

   res.status(200).send({success:true,message:  "OTP verified successfully",accessToken,referral,earning})
      } catch (error) {
         res. status(500).send({success: false,message: error.message})
      }
  
  } 
  module.exports = {login,verifyb2cOtp}