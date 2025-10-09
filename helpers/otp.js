const axios  = require("axios");

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };
  const generateLoanId= ()=> {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
const generateCardId = ()=>{
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const sendOTP = async (phone,otp) => {
    try {
    const apiKey = process.env.API_KEY_2fa; // Your 2Factor API key
    const templateId = process.env.TEMPLATE;
        const phonee = `+91${phone}`  
    const {data} = await axios.get(`https://2factor.in/API/V1/${apiKey}/SMS/${phonee}/${otp}/${templateId}`)
    // console.log(data)
    return data
      } catch (error) {
        res.status(500).send({success : false,message : error.message})
        console.error('Error sending OTP:', error);
      }
  };
const sendSMS = async (phoneNumber, message) => {
        phoneNumber = `+91${phoneNumber}` 
  // const apiKey = 'your_2factor_api_key'; // Replace with your actual API key
  const url = `https://2factor.in/API/V1/${process.env.API_KEY_2fa}/SMS/${phoneNumber}/${encodeURIComponent(message)}`;
  // https://2factor.in/API/V1/:api_key/SMS/:phone_number/AUTOGEN2/:otp_template_name

  try {
  await axios.get(url);
// console.log(response)
    // console.log('SMS sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const vendor = await venderModel.findOne({"basicInfo.mobile" : mobile,otp:otp});

    if (!vendor) {
      return res.status(400).send({success:false,message: "Vendor not found"});
    }

    if (vendor.otp != otp || vendor.otpExpires < Date.now()) {
      return res.status(400).send({success:false,message: "Invalid or expired OTP"});
    }
    if(!vendor.isVerified){
     await send
      notifyAdmin(vendor._id,"New vendor signup", `${vendor.basicInfo.username} sigup `);
    }
    vendor.otp = otp;
    // vendor.otpExpires = undefined;
    vendor.isVerified = true;
    await vendor.save();

     res.status(200).send({success:true,message:  "OTP verified successfully"})
  } catch (error) {
    console.log(error)
     res.status(500).send({success: false,message: error.message})
  }
};

function generateReferralCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
}
  module.exports = {generateReferralCode,sendSMS, generateOTP, sendOTP,generateLoanId,generateCardId };
  