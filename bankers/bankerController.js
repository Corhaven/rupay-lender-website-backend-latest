const { generateOTP } = require("../helpers/otp");
const { sendOtpEmail } = require("../helpers/otpMail");
const bankerModel = require("./bankerModel")
const jwt = require("jsonwebtoken");

const getBankerProfile = async(req,res)=>{
    try { 
    const {id} = req.params
    const profile  = await bankerModel.find({_id:id})
    res.status(200).send({success : true,message : "profile",profile})
} catch (error) {
    res.status(500).send({success : false,message : error.message})
}
 }
const verifyOtp = async(req,res)=>{
    const { OTP } = req.body;
    const {otp,otpExpires} = req.otp;
    if (otp === OTP && Date.now() < otpExpires) {
      res.status(200).send({ success: true, message: "Email verified" });
    } else {
      res.status(500).send({ success: false, message: "Invalid or expired OTP" });
    }  
}
const sendOtp = async(req,res)=>{
    const {email} = req.body
    const otp = generateOTP();

    const otpExpires = Date.now() + 300000; 
    const payload = {
        email, otp , otpExpires
    }
     const emailOtpToken = jwt.sign(payload, process.env.OTPSECRET, { expiresIn: '1h' });
 await sendOtpEmail(email,otp) 
  res.status(200).send({success : true,message :"send otp on email",emailOtpToken})
}
const updateProfile = async (req, res) => {
    try {
      const { id } = req.params;
      const { personalInfo, bankInfo, loanDetails, policyDetails } = req.body;
      const updatedData = {
        personalInfo: JSON.parse(personalInfo),
        bankInfo: JSON.parse(bankInfo),
        loanDetails: JSON.parse(loanDetails),
        policyDetails,
      };
    //   if (req.files.aadharCard) updatedData.kycDocuments.aadharCard = req.files.aadharCard[0].path;
    //   if (req.files.panCard) updatedData.kycDocuments.panCard = req.files.panCard[0].path;
  
      const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
      res.status(200).json({ message: 'User information updated successfully.', data: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user information.', error });
    }
  }

const createbanker =  async(req,res)=>{
    try {
        const { personalInfo, bankInfo, loanDetails, policyDetails,aadharDetails,whatsUppOpt} = req.body;
        // console.log(req.files?.aadharCard[0]?.location)
        // console.log(req.body)
        const newUser = new bankerModel({
          personalInfo: JSON.parse(personalInfo),
          bankInfo: JSON.parse(bankInfo),
          loanDetails: JSON.parse(loanDetails),
          aadharDetails : JSON.parse(aadharDetails),
          policyDetails,
          whatsUppOpt,
          kycDocuments: {
            employeCard: req.files?.employeCard[0]?.location || "",
          },
        });
        await newUser.save();
        res.status(201).json({ message: 'Banker information saved successfully.', data: newUser });
      } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error, error });
      }
    }
module.exports = {getBankerProfile,verifyOtp,sendOtp,createbanker}