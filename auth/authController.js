const { hashPassword } = require("../helpers/hashpassword");
const { generateOTP, sendOTP } = require("../helpers/otp");
const venderModel = require("../models/venderModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { notifyAdmin } = require("../helpers/socket");
// const { sendEmail } = require("../helpers/nodemailer");
const { default: axios } = require("axios");
// const { s3 } = require("../helpers/multer");
const { S3Client,PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require("dotenv");
const subVenderModel = require("../models/subVenderModel");
const Customer = require("../b2c/model/customerModel");
const wfhmodel = require("../carrier/model/wfhmodel");
// const { set } = require("mongoose");
dotenv.config()
const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

const sendOtp = async(req,res)=>{
  try {

   const {mobile} = req.body
   const otp = generateOTP()
   const otpExpires = Date.now() + 180000; 
   const payload = {
    mobile, otp , otpExpires
   }
  //  console.log(mobile)
    const otpToken = jwt.sign(payload, process.env.OTPSECRET, { expiresIn: '1h' });
    const data = await sendOTP(mobile, otp);
   if(data?.Status === 'Success'){
    return res.status(200).send({success: true,
      message: "Otp sent Successfully",otpToken})
   }else{
    return res.status(500).send({success: false,
      message: "Error occured"})
   }
    
  } catch (error) {
    res.status(500).send({success: false,message: error.message})

  }
} 
const verifyOtp = async(req,res)=>{
  try{
  const { otp } = req.body;
  console.log(req.body)
  // const {mobile} = 
  const tempUser = req.otp;
  if (tempUser.otpExpires < Date.now()) {
   return res.status(400).send({success:false,message: "expired OTP"});
 }
//  if (tempUser.basicInfo.mobile != mobile) {
//    return res.status(400).send({success:false,message: "wrong mobile no."});
//  }
console.log(tempUser.otp, otp)
 if (tempUser.otp != otp) {
   return res.status(400).send({success:false,message: "wrong OTP"});
 }
 if (!tempUser || tempUser.otp != otp || tempUser.otpExpires < Date.now()) {
   return res.status(400).send({success:false,message: "Invalid or expired OTP"});
 }  
 req.otp = null;
//  const vendor = new venderModel({isVerified: true}).save()
 const isVerified = true
 res.status(200).send({success:true,message:  "OTP verified successfully",isVerified})
    } catch (error) {
       res. status(500).send({success: false,message: error.message})
    }

} 

// const verifyOTP = async (req, res) => {  b
//     try {
//       const { mobile, otp } = req.body;

//       const tempUser = req.signUp;
//        if (tempUser.otpExpires < Date.now()) {
//         return res.status(400).send({success:false,message: "expired OTP"});
//       }
//       if (tempUser.basicInfo.mobile != mobile) {
//         return res.status(400).send({success:false,message: "wrong mobile no."});
//       }
//       if (tempUser.otp != otp) {
//         return res.status(400).send({success:false,message: "wrong OTP"});
//       }
//       if (!tempUser || tempUser.basicInfo.mobile !== mobile || tempUser.otp != otp || tempUser.otpExpires < Date.now()) {
//         return res.status(400).send({success:false,message: "Invalid or expired OTP"});
//       }  
//       const venderID = `PI${generateLoanId()}` 
//       const vendor =  new venderModel({
//         venderID,
//             basicInfo :
//            tempUser.basicInfo,
//           //  referral : tempUser? tempUser.referral : " " , 
//            password :tempUser.password,
//            otp : tempUser.otp,
//            isVerified: true,
//             otpExpires : tempUser.otpExpires })
//       await vendor.save();
//       req.signUp = null;
//       const subject = "New vendor signup"
//       const message = `We are excited to inform you that a new vendor has successfully signed up on the Rupay Lender platform. Below are the details of the new vendor:

// Vendor Details:
// - Vendor ID: ${venderID}
// - Name: ${tempUser.basicInfo.username}
// - Mobile Number: ${tempUser.basicInfo.mobile}
// - Referral Code: ${tempUser? tempUser.referral : "No referral"}`
// const htmlMessage = `<p>Dear Admin,</p>
//            <p>We are excited to inform you that a new vendor has successfully signed up on the Rupay Lender platform. Below are the details of the new vendor:</p>
//            <p><strong>Vendor Details:</strong></p>
//            <ul>
//                <li><strong>Vendor ID:</strong> ${venderID}</li>
//                <li><strong>Name:</strong> ${tempUser.basicInfo.username}</li>
//                <li><strong>Mobile Number:</strong> ${tempUser.basicInfo.mobile}</li>
//                <li><strong>Referral Code:</strong> ${tempUser? tempUser.referral : "No referral"}</li>
//            </ul>`
//       sendEmail(subject,htmlMessage,message)
//        res.status(200).send({success:true,message:  "OTP verified successfully and user register",vendor})
//     } catch (error) {
//        res.status(500).send({success: false,message: error.message})
//     }
//   };
  
  // const resetPassword = async (req, res) => {
  //   try {

  //     const { mobile, otp, newPassword ,conformpassword} = req.body;
  //     if(newPassword !=  conformpassword){
  //       return res.status(400).send({success : false,message :'password are not same' }) 
  //     }

  //     const vendor = await venderModel.findOne({ 'basicInfo.mobile': mobile });
  //     if (!vendor) {
  //     return res.status(400).send({success : false,message :'vendor not found' })
  //     }
  //        const tempUser =  req.forgot
  //        console.log(tempUser)
  //     if (tempUser.otp != otp || tempUser.otpExpires < Date.now()) {
        
  //        return res.status(400).send({success : false, message : "Invalid or expired OTP"})
  
  //     }
  //     const hashedPassword = await hashPassword(newPassword)
  //     vendor.password = hashedPassword;
  //     vendor.otp = undefined;
  //     vendor.otpExpires = undefined;
  
  //     await vendor.save();
  //     res.status(200).send({success : true, message : 'Password reset successfully'})
  
  //   } catch (error) {
  //     res.status(400).send({success : false, message : error.message})
  
  //   }
  // }
  
  const forgotPasswordController= async(req,res)=>{
    
    try {
      const { mobile } = req.body;
      const vendor = await venderModel.findOne({ 'basicInfo.mobile': mobile});

      if (!vendor) {
       return res.status(400).send({success : false,message :'vendor not found' })
      }
      if(!vendor.isVerified){
        return res.status(400).send({success :true,message :"vendor mobile no. is not verified"})
      }
  
      const otp = generateOTP();
      const otpExpires = Date.now() + 3600000; // 1 hour
     const payload = { mobile, otp, otpExpires}
     const forgotToken = jwt.sign(payload, process.env.NEW_SECRET,{ expiresIn: '1h' });

      // req.session.resetUser = { mobile, otp, otpExpires };

      await sendOTP(mobile, otp);
     
     
      return  res.status(200).send({success: true,  message:'OTP sent for password reset',forgotToken});
    }catch (error) {
    
         res.status(500).send({success : false, message : error.message});
    }
  };
  
  const changePasswordController = async(req,res)=>{
    try {
      const {oldPassword,newPassword,confirmPassword} = req.body
      if(oldPassword === newPassword){
        return res.status(400).send({success:false,message :"old Password can't be same as new password"})
      }
      if(newPassword != confirmPassword ){
        return res.status(400).send({success:false,message :"new password and conform password does not match"})
      }
      const id = req.vendor._id;
      const vendor = await venderModel.findById(id);
      if(!vendor){
        return res.status(400).send({success:false,message :"vendor not found"})
      }
      const isMatch = await bcrypt.compare(oldPassword,vendor.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid old password' });
      }
      const hashedPassword = await hashPassword(newPassword)
      vendor.password = hashedPassword;
      await vendor.save()
      res.status(200).send({success : true,message :" password change successfully"}) 

    } catch (error) {
      res.status(400).send({success : false,message : error.message}) 
    }
  }
  const verifyResetOtp = async (req, res) => {
    try {
        const { mobile, otp, newPassword  } = req.body;
        
        const resetUser = req.forgot;

        if (!resetUser || resetUser.mobile != mobile || resetUser.otp != otp || resetUser.otpExpires < Date.now()) {
            return res.status(400).send({success : false, message: 'Invalid or expired OTP' });
        }
        const hashedPassword = await hashPassword(newPassword)
        await venderModel.findOneAndUpdate({ 'basicInfo.mobile' : mobile }, { password: hashedPassword });
      
        req.resetUser = null;

        res.status(200).send({success : true, message: 'Password reset successful' });
    } catch (err) {
     console.log(err.message)
        res.status(500).send({success : false, message: 'Server error' });
    }
};

const resendResetOtp = async (req, res) => {
    try {
        const {  mobile } = req.body;
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
      if (req.forgot && req.forgot.mobile == mobile) {
        req.forgot.otp = otp;
        req.forgot.otpExpires = otpExpires;
        const payload = req.forgot
        const newToken = jwt.sign(payload, process.env.NEW_SECRET);
         const data =    await sendOTP(mobile, otp);
            if(data.Status === 'Success'){
              return res.status(200).send({success : true, message: 'OTP resent',newToken });

             }
        } else {
            res.status(400).send({ success : false,message: 'User not found or session expired' });
        }
    } catch (err) {
        res.status(500).send({success : false, message: 'Server error' });
    }
};
const aadharOtp = async(req,res)=>{
  
  try {
    // console.log("d")
    const aadhaar_number = req.body.aadhaar_number;
    // console.log(typeof aadhaar_number)
    const {data} = await axios.post('https://api.cashfree.com/verification/offline-aadhaar/otp', {
      aadhaar_number: aadhaar_number,
    }, {
      headers: {
        'x-client-id': process.env.CASHFREE_CLIENT_ID,
        'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
      }
    });

    res.status(200).send({success : true , data});
  } catch (error) {
    res.status(500).send(error.response ? error.response.data : error.message);
  }

}
const verifyAdharOtp = async (req, res) => {
  const { otp, ref_id,aadhaar_number } = req.body;
  const vendorId = req.vendor._id; 
 
  try {
    const {data} = await axios.post('https://api.cashfree.com/verification/offline-aadhaar/verify', {
      otp: otp,
      ref_id: ref_id,
    }, {
      headers: {
        'x-client-id': process.env.CASHFREE_CLIENT_ID,
        'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
      }
    });
    // console.log(data)
    // Handle the verification response
    const base64Image = data.photo_link; // assuming the photo field contains the base64 image
    const buffer = Buffer.from(base64Image, 'base64');
  // console.log(buffer)
    const s3Key = `aadhar-photo-${Date.now()}.jpg`;
const bucket  = req.vendor.role === "vendor"?"rupay-lender-vendor-signup" : req.vendor.role === "telecaller" ? "rupay-lender-telecaller-signup" : "rupay-lender-web-bucket"
    const params = {
      Bucket: bucket,
      Key: s3Key,
      Body: buffer,
      ACL: "public-read",
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    };
    const command = new PutObjectCommand(params);

   await s3.send(command);
   const imageUrl= `https://${params.Bucket}.s3.amazonaws.com/${s3Key}`
  //  console.log("data",data)
   if(data.status == 'VALID'){
      const aadharDetails = {
       name : data.name,
       aadhaar_number,
       gender:  data.gender,
       care_of:  data.care_of,     
       dob:data.dob,
       status:data.status ,
       ref_id: data.ref_id,
       address: data.address,
        imageUrl
      }
      let vendor ,updatedUser;
     if(req.vendor.role === "vendor"){
       updatedUser = await venderModel.findById(vendorId)
      updatedUser.aadharDetails = aadharDetails
      await updatedUser.save()
      if(updatedUser.panDetails && updatedUser.aadharDetails) {
       vendor = await venderModel.findByIdAndUpdate(
            vendorId,
          { activeStatus : 'active'},
          { new: true } 
      );
      }
  //   }else if(req.vendor.role === "telecaller"){
  //        updatedUser = await wfhmodel.find({mobile:req.vendor.vendorInfo.mobile})
  //      updatedUser.aadharDetails = aadharDetails
  //      await updatedUser.save()
  // // updatedUser = await wfhmodel.findById(vendorId)
  // //     updatedUser.aadharDetails = aadharDetails
  // //     await updatedUser.save()
  //     if(updatedUser.panDetails && updatedUser.aadharDetails) {
  //      vendor = await wfhmodel.findByIdAndUpdate(
  //           updatedUser?._id,
  //         { activeStatus : 'active'},
  //         { new: true } 
  //     );
  //     }
  //        updatedUser = await wfhmodel.findOneAndUpdate({mobile:req.vendor.vendorInfo.mobile}, { $set: { aadharDetails: aadharDetails } },   { new: true }     )
    
  //     // const isAadharVerified = false;
  //      if(updatedUser?.aadharDetails){

  //        if(updatedUser?.panDetails)  {
  //          vendor = await wfhmodel.findByIdAndUpdate(
  //            updatedUser?._id,
  //            { activeStatus : 'active'},  
  //            { new: true } 
  //           );
  //                 return res.status(200).send({success : true , message : "Aadhar verified",vendor ,updatedUser});

  //         }
  //               return res.status(200).send({success : true , message : "Aadhar verified",updatedUser});
  //       }
  //   }
    }else if (req.vendor.role === "telecaller") {

  updatedUser = await wfhmodel.findOneAndUpdate(
    { mobile: req.vendor.vendorInfo.mobile },
    { $set: { aadharDetails } },
    { new: true }
  );

  if (updatedUser?.panDetails && updatedUser?.aadharDetails) {
    vendor = await wfhmodel.findByIdAndUpdate(
      updatedUser._id,
      { activeStatus: "active" },
      { new: true }
    );
  }

  return res.status(200).send({
    success: true,
    message: "Aadhar verified",
    updatedUser,
    vendor
  });
}

    else{
         updatedUser = await subVenderModel.findById(vendorId)
      updatedUser.aadharDetails = aadharDetails
      await updatedUser.save()
      if(updatedUser.panDetails && updatedUser.aadharDetails) {
       vendor = await subVenderModel.findByIdAndUpdate(
            vendorId,
          { activeStatus : 'active'},  
          { new: true } 
      );
      }
     }    
       res.status(200).send({success : true , message : "aadhar verified",vendor,updatedUser });
    };

   }catch (error) {
    res.status(500).send({success : false,message : error.message});
  }
};
const verifyAdharOtpBanker = async (req, res) => {
  const { otp, ref_id,aadhaar_number } = req.body;

  // const vendorId = req.vendor._id; 
  // console.log(vendorId)
  try {
    const {data} = await axios.post('https://api.cashfree.com/verification/offline-aadhaar/verify', {
      otp: otp,
      ref_id: ref_id,
    }, {
      headers: {
        'x-client-id': process.env.CASHFREE_CLIENT_ID,
        'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
      }
    });
    // console.log(data)
    // Handle the verification response
    const base64Image = data.photo_link; // assuming the photo field contains the base64 image
    const buffer = Buffer.from(base64Image, 'base64');
  // console.log(buffer)
    const s3Key = `aadhar-photo-${Date.now()}.jpg`;

    const params = {
      Bucket: "rupay-lender-banker-info",
      Key: s3Key,
      Body: buffer,
      ACL: "public-read",
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    };
    const command = new PutObjectCommand(params);

   await s3.send(command);
   const imageUrl= `https://${params.Bucket}.s3.amazonaws.com/${s3Key}`
  //  console.log("data",data)
   if(data.status == 'VALID'){
      const aadharDetails = {
       name : data.name,
       aadhaar_number,
       gender:  data.gender,
       care_of:  data.care_of,     
       dob:data.dob,
       status:data.status ,
       ref_id: data.ref_id,
       address: data.address,
        imageUrl
      
      }
      // console.log("aadharDetails",aadharDetails)
      // const updatedUser = await venderModel.findById(vendorId)
      // updatedUser.aadharDetails = aadharDetails
      // await updatedUser.save()
      // let vendor ;
      // if(updatedUser.panDetails && updatedUser.aadharDetails) {
   
      //  vendor = await venderModel.findByIdAndUpdate(
      //       vendorId,
      //     { activeStatus : 'active'},
      //     { new: true } 
      // );
      // }
       res.status(200).send({success : true , message : "aadhar verified",aadharDetails });
    };

  } catch (error) {
    res.status(500).send({success : false,message : error.message});
  }
};
const panVerify = async(req,res)=>{
  
  try {
    const {pan, valid, panType} = req.body;
    const vendorId = req.vendor._id; 
    console.log(vendorId,"vendorId")
    const {data} = await axios.post('https://api.cashfree.com/verification/pan', {
      pan,
      valid,     
      panType
    },{
      headers: {
        'x-client-id': process.env.CASHFREE_CLIENT_ID,
        'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
      }
    });
     if(data?.valid){
      const panDetails = {
        pan: data.pan,
        valid:  data.valid,     
        panType:data.type ,
        name : data.registered_name
        
      }
      let vendor ,updatedUser;
      if(req.vendor.role === "vendor"){
        updatedUser = await venderModel.findById(vendorId)
       updatedUser.panDetails = panDetails
       await updatedUser.save()
       if(updatedUser.panDetails && updatedUser.aadharDetails) {
        vendor = await venderModel.findByIdAndUpdate(
             vendorId,
           { activeStatus : 'active'},
           { new: true } 
       );
       }
     }else if(req.vendor.role === "telecaller"){
      // console.log("sdf",req.vendor.vendorInfo.mobile)
        //  updatedUser = await wfhmodel.findById({mobile:req.vendor.vendorInfo.mobile})
         const updatedUser = await wfhmodel.findOneAndUpdate({mobile:req.vendor.vendorInfo.mobile}, { $set: { panDetails: panDetails } },   { new: true }     )
    
      const isPanVerified = false;
       if(updatedUser?.panDetails){

         if(updatedUser?.aadharDetails)  {
           vendor = await wfhmodel.findByIdAndUpdate(
             updatedUser?._id,
             { activeStatus : 'active'},  
             { new: true } 
            );
                  return res.status(200).send({success : true , message : "pan verified",vendor ,updatedUser});

          }
                return res.status(200).send({success : true , message : "pan verified",isPanVerified:true});

        }

     }

     else{
          updatedUser = await subVenderModel.findById(vendorId)
       updatedUser.panDetails = panDetails
       await updatedUser.save()
       if(updatedUser.panDetails && updatedUser.aadharDetails) {
        vendor = await subVenderModel.findByIdAndUpdate(
             vendorId,
           { activeStatus : 'active'},  
           { new: true } 
       );
       }
      }  
      return res.status(200).send({success : true , message : "pan verified",vendor ,updatedUser});
     }
    res.status(200).send({success : false , message : "pan not verified",data});
  } catch (error) {
    res.status(500).send(error.response ? error.response.data : error.message);
  }

}
const bankVerify = async(req,res)=>{  
  try {
    const vendorId = req.vendor._id; 
    const {bank_account,
  ifsc,
  name,
  phone
}= req.body;

    const {data} = await axios.post('https://api.cashfree.com/verification/bank-account/sync', {
      bank_account,
      ifsc,
      name,
      phone
    }, {
      headers: {
        'x-client-id': process.env.CASHFREE_CLIENT_ID,
        'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
      }
    });
    // console.log("data",data)
    if(data.account_status == 'VALID'){
       const bankDetail = {
        bank_account,
        ifsc,
        phone,
        name_at_bank :data.name_at_bank,
          reference_id :data.reference_id,
        bank_name : data.bank_name,
          city : data.city,
          branch : data.branch,
          micr : data.micr,
          account_status : data.account_status
      
       }
      //  console.log("bankDetail",bankDetail)
      let updatedUser;
     if(req.vendor.role === "vendor"){
      updatedUser = await venderModel.findById(vendorId)
       updatedUser.bankDetail = bankDetail
       await updatedUser.save()
  
    }else if(req.vendor.role === "customer"){
          updatedUser = await Customer.findById(vendorId)
      updatedUser.bankDetail = bankDetail
       updatedUser.isBankVerified = true
      await updatedUser.save()
    }else if(req.vendor.role === "telecaller"){
      //     updatedUser = await Customer.findById(vendorId)
      // updatedUser.bankDetail = bankDetail
      //  updatedUser.isBankVerified = true
      // await updatedUser.save()
         updatedUser = await wfhmodel.findOneAndUpdate({mobile:req.vendor.vendorInfo.mobile}, { $set: { bankDetail: bankDetail,isBankVerified: true} },   { new: true }     )
    
      // const isPanVerified = false;
       if(updatedUser?.bankDetail){

       
                return res.status(200).send({success : true , message : "Bank verified",isBankVerified:true,updatedUser});

        }
    }

    else{
         updatedUser = await subVenderModel.findById(vendorId)
      updatedUser.bankDetail = bankDetail;
           

      await updatedUser.save()
      
     }
     res.status(200).send({success : true , message: "bank Acoount verified",updatedUser});
     }
     res.status(500).send({success:false,message:"Error occured"});
  } catch (error) {
    res.status(500).send(error.response ? error.response.data : error.message);
  }

  }

  const gstVerify = async(req,res)=>{
  
    try {
      const {GSTIN} = req.body;
      const vendorId = req.vendor._id; 
  
      const {data} = await axios.post('https://api.cashfree.com/verification/gstin', {
        GSTIN
      }, {
        headers: {
          'x-client-id': process.env.CASHFREE_CLIENT_ID,
          'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
        }
      });
      // console.log(data)
       if(!data.valid){
        return res.status(500).send({success : false , message : "gst not verified",data});
        }

        const gstDetails = {
            reference_id: data.reference_id,
              GSTIN: data.GSTIN,
              legal_name_of_business: data.legal_name_of_business,
              date_of_registration: data.date_of_registration,
              constitution_of_business: data.constitution_of_business,
              taxpayer_type:  data.taxpayer_type,
              gst_in_status : data.gst_in_status,
              nature_of_business_activities: data.nature_of_business_activities,
              principal_place_address: data.principal_place_address,
              valid: data.valid
          
        }
        let updatedUser;
        if(req.vendor.role === "vendor"){
          updatedUser = await venderModel.findById(vendorId)
          updatedUser.gstDetails = gstDetails
          await updatedUser.save()
     
       }else{
            updatedUser = await subVenderModel.findById(vendorId)
         updatedUser.gstDetails = gstDetails
         await updatedUser.save()
         
        }
        res.status(200).send({success : true , message: "bank Acoount verified",updatedUser});
        
       
       
    } catch (error) {
      res.status(500).send(error.response ? error.response.data : error.message);
    }
  
  }
  const verifyAdharOtpShop = async (req, res) => {
    const { otp, ref_id,aadhaar_number } = req.body;
  
    // const vendorId = req.vendor._id; 
    // console.log(vendorId)
    try {
      const {data} = await axios.post('https://api.cashfree.com/verification/offline-aadhaar/verify', {
        otp: otp,
        ref_id: ref_id,
      }, {
        headers: {
          'x-client-id': process.env.CASHFREE_CLIENT_ID,
          'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
        }
      });
 
      const base64Image = data?.photo_link; // assuming the photo field contains the base64 image
      const buffer = Buffer.from(base64Image, 'base64');
    // console.log(buffer)
      const s3Key = `aadhar-photo-${Date.now()}.jpg`;
  
      const params = {
        Bucket: "rupay-lender-vendor-signup",
        Key: s3Key,
        Body: buffer,
        ACL: "public-read",
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
      };
      const command = new PutObjectCommand(params);
  
     await s3.send(command);
     const imageUrl= `https://${params.Bucket}.s3.amazonaws.com/${s3Key}`
    //  console.log("data",data)
     if(data?.status == 'VALID'){
        const aadharDetails = {
         name : data.name,
         aadhaar_number,
         gender:  data.gender,
         care_of:  data.care_of,     
         dob:data.dob,
         status:data.status ,
         ref_id: data.ref_id,
         address: data.address,
          imageUrl     
        }
   
        return res.status(200).send({success : true , message : "aadhar verified",aadharDetails});
      };
  
    } catch (error) {
      res.status(500).send({success : false,message : error.message});
    }
  };
  const panVerifyShop = async(req,res)=>{
  
    try {
      const {pan, valid, panType} = req.body;
      // const vendorId = req.vendor._id; 
  
      const {data} = await axios.post('https://api.cashfree.com/verification/pan', {
        pan,
        valid,     
        panType
      }, {
        headers: {
          'x-client-id': process.env.CASHFREE_CLIENT_ID,
          'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
        }
      });
      // console.log(data)
       if(data?.valid){
        const panDetails = {
         
          pan: data.pan,
          valid:  data.valid,     
          panType:data.type ,
          name : data.registered_name
          
        }
       
        
        return res.status(200).send({success : true , message : "pan verified",panDetails});
       }
      res.status(200).send({success : false , message : "pan not verified",data});
    } catch (error) {
      res.status(500).send(error.response ? error.response.data : error.message);
    }
  
  }
  const bankVerifyShop = async(req,res)=>{
  
    try {
      // const vendorId = req.vendor._id; 
      const {bank_account,
    ifsc,
    name,
    phone
  }= req.body;
  
      const {data} = await axios.post('https://api.cashfree.com/verification/bank-account/sync', {
        bank_account,
        ifsc,
        name,
        phone
      }, {
        headers: {
          'x-client-id': process.env.CASHFREE_CLIENT_ID,
          'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
        }
      });
      // console.log("data",data)
      if(data?.account_status == 'VALID'){
         const bankDetail = {
          bank_account,
          ifsc,
     
          phone,
          name_at_bank :data.name_at_bank,
     
            reference_id :data.reference_id,
          bank_name : data.bank_name,
        
            city : data.city,
            branch : data.branch,
            micr : data.micr,
            account_status : data.account_status
        
         }
        //  console.log("bankDetail",bankDetail)
        //  const updatedUser = await venderModel.findById(vendorId)
        //  updatedUser.bankDetail = bankDetail
        //  await updatedUser.save()
         res.status(200).send({success : true , message: "bank Acoount verified",bankDetail});
        }
    } catch (error) {
      res.status(500).send(error.response ? error.response.data : error.message);
    }
  
    }
  module.exports = {bankVerifyShop,panVerifyShop,verifyAdharOtpShop,verifyAdharOtpBanker,verifyOtp,sendOtp,gstVerify,bankVerify,panVerify,verifyAdharOtp,aadharOtp,resendResetOtp,verifyResetOtp,changePasswordController,forgotPasswordController}
