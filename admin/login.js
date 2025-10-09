const mongoose = require('mongoose');
const { hashPassword } = require('../helpers/hashpassword');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const loanModel = require('../models/loanModel');
const venderModel = require('../models/venderModel');
// const subAdmModel = require('../models/subAdmModel');
const { any } = require('joi');
const subAdmModel = require('../models/subAdmModel');
const { generateLoanId, generateOTP } = require('../helpers/otp');
const bankerModel = require('../bankers/bankerModel');
const bankmodel = require('../models/bankmodel');
// const bankerModel = require('../bankers/bankerModel');
// const JSONStream = require('JSONStream')
const XLSX = require("xlsx");
const bankerListmodel = require('../models/bankerListmodel');
const wfhmodel = require('../carrier/model/wfhmodel');
const { sendOtpEmail } = require('../helpers/otpMail');
const adminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fcmToken: {
    type: String,
  },
  role: { type: String, enum: ['vendor', 'admin', 'sub-admin'], required: true }
});
adminModel = mongoose.model('Admin', adminSchema);
// module.exports = adminModel
const createAdmin = async (req, res) => {
    try {
      const { username,email, password, role,} = req.body;
      const hashedPassword = await hashPassword(password)
      const admin = new adminModel({ username,email, password: hashedPassword, role });
      await admin.save();
      // console.log(admin)
    //   const token = jwt.sign({ id: admin._id, role: user.role }, 'your_secret_key');
      res.status(201).send({ admin });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };
const createSubAdmin = async (req, res) => {
  try {
    // console.log(req.body)
    let { username,email, role,department,mobile,referral,permissions,referralLink} = req.body;
    // referral = referral ? referral : " "
    // referralLink = referralLink ? referralLink : " "

    // const referralLink = `https://rupaylender.com/signup/${referral}`
    // console.log(req.body)
    // const hashedPassword = await hashPassword(password)
    const subAdmin = new subAdmModel({ username,email, role,department,mobile,referral,permissions,referralLink });
    // console.log(subAdmin)
    await subAdmin.save();
  //   const token = jwt.sign({ id: admin._id, role: user.role }, 'your_secret_key');
    res.status(200).send({success : true,message : "Subadmin creted", subAdmin });
  } catch (error) {
    res.status(400).send({success : false, message: error.message });
  }
};
const updateSubAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    // if (typeof active !== 'boolean') {
    //   return res.status(400).json({ error: 'Invalid status value' });
    // }

    const updatedAdmin = await subAdmModel.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ error: 'Subadmin not found' });
    }

    res.json({
      message: 'Status updated successfully',
      data: updatedAdmin
    });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
const deleteSubAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdmin = await subAdmModel.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({ error: 'Subadmin not found' });
    }

    res.json({
      message: 'Subadmin deleted successfully',
      data: deletedAdmin
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
//  const  login = async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const admin = await adminModel.findOne({ email });
//       if (!admin || !bcrypt.compareSync(password, admin.password)) {
//         return res.status(401).send({message : "wrong email or password" });
//       }
//       // console.log(admin)
//       const token = jwt.sign({ _id: admin._id, username: admin.username, role: admin.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });
//       // console.log(token)
//       res.status(200).send({success:true ,token,message:"success" });
//       //, admin: { id: admin._id, username: admin.username, role: admin.role }
//     } catch (error) {
//       res.status(500).send({ error: error.message });
//     }
//   };
  const login = async (req, res) => {
      try {
        const { email } = req.body;
      // console.log(email)
        const admin = await adminModel.findOne({ email });
        if(!admin.length ==0) return res.status(400).send({success : false, message:"Wrong Email"})
       const otp = generateOTP();
  
      const otpExpires = Date.now() + 300000; 
      const payload = {
          email, otp , otpExpires
      }
       const emailOtpToken = jwt.sign(payload, process.env.OTPSECRET, { expiresIn: '5m' });
   await sendOtpEmail(email,otp) 
    res.status(200).send({success : true,message :"send otp on email",emailOtpToken})

      }catch(error){
        res.status(500).send({success:false, message: error.message });
      }
    };
    const verifyEmail = async(req,res)=>{
      try {
          const { OTP } = req.body;
      const {email,otp,otpExpires} = req.otp;

      if (otp === OTP && Date.now() < otpExpires) {
          const admin = await adminModel.findOne({ email });
        const token = jwt.sign({ _id: admin?._id, username: admin?.username, role: admin?.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });
      // console.log(token)
      res.status(200).send({success:true ,token,message:"success" });
        // res.status(200).send({ success: true, message: "Email verified" });
      } else {
        res.status(500).send({ success: false, message: "Invalid or expired OTP" });
      }  
      } catch (error) {
        res.status(500).send({ success: false, message: error.message });
      }
    }
const getId = async(req,res)=>{
  try {
     const id = await adminModel.find().select('_id')
     res.status(200).send({success:true ,id,message:"success" });
  } catch (error) {
    console.log(error.message)
    res.status(500).send({success:false ,id,message:error.message });

  }
}
const allVendors = async(req,res)=>{
  try {
     const vendors = await venderModel.find({}).sort({ createdAt: -1 }).lean();
    // const vendorCursor = await venderModel.find({}).sort({ createdAt: -1 }).lean().cursor();

     if(!vendors){
      return res.status(500).send({success : false,message :"vendors not found"})
     }
    //  console.log(vendorCursor)
     
    // res.setHeader('Content-Type', 'application/json');
    // vendorCursor.pipe(JSONStream.stringify()).pipe(res);
    //  console.log(vendors)
     res.status(200).send({success : true,message : "vendors fetch success",vendors})
  }catch(err){
    res.status(500).send({success : false,message : err.message})

  }
}
const getAllSubadmin = async(req,res)=>{
try {
  const subAdmins = await subAdmModel.find({})
  if(!subAdmins){
    return res.status(500).send({success : false,message :"subAdmins not found"})

} 
res.status(200).send({success : true,message : "get subadmins",subAdmins})
}catch (error) {
  res.status(400).send({success:false,message : error.message})
}}
const searchvendorController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const regexKeyword = new RegExp(keyword, 'i'); // Create a regex from the keyword

    const resutls = await venderModel
      .find({
        $or: [
          { 'basicInfo.city': { $regex: regexKeyword } },
          { 'basicInfo.state': { $regex: regexKeyword } },
          { 'basicInfo.username': { $regex: regexKeyword } },
          { 'referral': { $regex: regexKeyword } },
          { $expr: { $regexMatch: { input: { $toString: "$basicInfo.mobile" }, regex: keyword, options: "i" } } },
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

const refferOffer = async (req, res) => {
  try {
    const { earnings, type } = req.body;
  const referralCode = generateLoanId()
  // https://rupaylender.com/b2c/credit-card-landing
  // https://rupaylender.com/b2c/personal-loan-landing
  // https://rupaylender.com/b2c/home-loan-landing
  // https://rupaylender.com/b2c/business-landing
  // 
  const referralLink = `https://example.com/referral/${referralCode}`
    if (!earnings || !type || !referralCode || !referralLink) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newOffer = new RefferOffer({
      earnings,
      type,
      referralCode,
      referralLink,
    });

    const savedOffer = await newOffer.save();
    res.status(201).json(savedOffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const updateVendorStatus = async (req, res) => {
  try {
      const vendorId = req.params.id;
      const { activeStatus } = req.body;

      if (!['active', 'inactive','pending'].includes(activeStatus)) {
          return res.status(400).json({ message: 'Invalid status value' });
      }

      const vendor = await venderModel.findByIdAndUpdate(
            vendorId,
          { activeStatus },
          { new: true } 
      );

      if (!vendor) {
          return res.status(404).json({ message: 'Vendor not found' });
      }

      res.status(200).json({
          message: `Vendor status updated to ${activeStatus}`,
          vendor,
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getBankers = async(req,res)=>{
  try {
    // console.log("ewd")
    const bankers  = await bankerModel.find({})
  if(bankers.length == 0 ){
    res.status(500).send({success : false , message : "No banker found"})
  }
  res.status(200).send({success : true , message : "Banker found successfully",bankers})
  } catch (error) {
    res.status(500).send({success : false , message : error.message})
  }
}
 const uploadBanks = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    
    const workbook =  XLSX.readFile(req.file.path);
 
    const sheet_name_list = workbook.SheetNames;
  
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { defval: '' });
   
    const mappedData = jsonData.map(row => {
      return {
        pincode: row['Pincode'],
        bankName: row['Bank Name'],
        products: row['Products'],
      };
    });
    await bankmodel.insertMany(mappedData);
    res.status(200).send('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data');
  }
};
const uploadBankerList = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    
    const workbook =  XLSX.readFile(req.file.path);
 
    const sheet_name_list = workbook.SheetNames;
  
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { defval: '' });
  //  console.log(jsonData)
    const mappedData = jsonData.map(row => {
      return {
        bankerName: row['Name '],
        mobile: row['Mobile '],
        bankName: row['Bank Name'],
        products: row['Product'],
        pincode: row['Pincode'],
      };
    });
    // console.log(mappedData)
    await bankerListmodel.insertMany(mappedData);
    res.status(200).send('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data');
  }
};
const  moveVenders = async (req, res) => {
  try {
      const { venders, movedReferral } = req.body;

      // Ensure venders is an array
      if (!Array.isArray(venders) || venders.length === 0) {
          return res.status(400).json({ message: "Invalid vendors list" });
      }
      let movedVenders = await Promise.all(
          venders.map(async (id) => {
              return await venderModel.findByIdAndUpdate(
                  id,
                  { 'basicInfo.referral': movedReferral },
                  { new: true }
              );
          })
      );
      return res.status(200).json({ message: "Vendors updated successfully", movedVenders });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// const getTelecallers = async(req,res)=>{
//   try {
//     console.log("ewdf")
//     const telecaller = await wfhmodel.find()
//   if(!telecaller && !telecaller.length ==0){
//     return res.status(500).send({success : false, message :"No telecaller found"})

//   }
//  res.status(200).send({success : false, message :" telecallers found" , telecaller})
 

//   } catch (error) {
//     console.log("first")
//     return res.status(500).send({success : false, message :error.message})

//   }
// }

const alltelecaller = async(req,res)=>{
  try {
     const telecallers = await wfhmodel.find({}).sort({ createdAt: -1 }).lean();

     if(!telecallers){
      return res.status(500).send({success : false,message :"telecaller not found"})
     }
   
     res.status(200).send({success : true,message : "telecaller fetch success",telecallers})
  }catch(err){
    res.status(500).send({success : false,message : err.message})

  }
}
 const telecallerLead = async(req,res)=>{
    console.log("edf")
    const loans = await loanModel.find({role:"telecaller"})
    return    res.status(200).send({success : true , message : "telecaller successfully fetch",loans})
 }

module.exports = {telecallerLead,deleteSubAdmin,updateSubAdmin,verifyEmail,alltelecaller,moveVenders,uploadBankerList,uploadBanks,getBankers,updateVendorStatus,refferOffer,createAdmin,getAllSubadmin,login,allVendors,getId,adminModel,createSubAdmin,searchvendorController}
