
const vendorSchema = require("./vendorSchema");
const venderModel = require("../models/venderModel");
const {  comparePassword } = require("../helpers/hashpassword");
const jwt = require("jsonwebtoken");
const { generateOTP, sendOTP, sendSMS, generateLoanId, generateCardId } = require("../helpers/otp");
const loanModel = require("../models/loanModel");
const paymentModel = require("../models/paymentModel");

const notificationModel = require("../models/notificationModel");
const { sendEmail } = require("../helpers/nodemailer");
const subAdmModel = require("../models/subAdmModel");
const { createUser } = require("../helpers/whatsupBulk");
const shopModel = require("../b2c/model/shopModel");
const statusHistoryModel = require("../models/statusHistoryModel");
const subVenderModel = require("../models/subVenderModel");
const walletHistoryModel = require("../models/walletHistoryModel");
const updateWalletAndLogHistory = require("../helpers/walletUpdate");
const blogModel = require("../models/blogModel");
const EventSubcriberModel = require("../models/EventSubcriberModel");
const dayjs = require("dayjs");
const { subsCribeSubject, subscribeHTMLMessage, subscribeMessage } = require("../helpers/messageMail");
// const { sendWhatsMessage, triggerEvent, createUser } = require("../whatsuppBulk");


const signUp = async (req, res) => {
  try { 
    const {username,email,mobile,plan,state,city,pinCode,address,experience,whatsUppOpt} = req.body;
    // console.log(req.body)
    const exisitingUser = await venderModel.findOne(
      {
        $or: [
          { 'basicInfo.email': email },
          { 'basicInfo.mobile': mobile }
        ]
      }) 
   
    // const qualification = " "
  
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "already Register please login",
      });
    }
  
    const venderID = `PI${generateLoanId()}` 

    const vender = new venderModel({ basicInfo :
      { username,email,mobile,plan,state,city,pinCode,address,experience},
      isVerified : true,venderID,whatsUppOpt})
      await vender.save()
    if(!vender){
      return res.status(500).send({
        success: false,
        message: "Error occured"     
      });
    }
  
    const recipients = [
      { email:"corhaven.india@gmail.com"}
  ]; 
    const subject = "New vendor signup"
          const message = `We are excited to inform you that a new vendor has successfully signed up on the Rupay Lender platform. Below are the details of the new vendor:
    
     Vendor Details:
     - Vendor ID: ${venderID ? venderID : " "}
     - Name: ${username ? username : " "}
     - Mobile Number: ${mobile ? mobile : " "}
     - Payment: ${vender?.paymentStatus || "unPaid"}`
     
    const htmlMessage = `<p>Dear Admin,</p>
               <p>We are excited to inform you that a new vendor has successfully signed up on the Rupay Lender platform. Below are the details of the new vendor:</p>
               <p><strong>Vendor Details:</strong></p>
               <ul>
                   <li><strong>Vendor ID:</strong> ${venderID ? venderID : " "}</li>
                   <li><strong>Name:</strong> ${username ? username : " "}</li>
                   <li><strong>Mobile Number:</strong> ${mobile ? mobile : " "}</li>
                   <li> Payment: ${vender?.paymentStatus || "unPaid"}</li>
               </ul>`
     await sendEmail(subject,htmlMessage,message,recipients)

    res.status(200).send({success : true , message : "Vendor registerd successfully ,Please for payment"})
  } catch (error) {

 console.log(error.message)
    res.status(500).send({
      success: false,
      message: error.message,
   
    });
  }}
   
const   loginController = async (req,res) =>{
  try {
  const {email,password} = req.body;
  const vendor = await venderModel.findOne({"basicInfo.email" : email});
  
  const plan = vendor?.basicInfo?.plan

  if(!vendor){
    return res.status(401).send({
      success:false,
      message:"Invalid Email ",
      });
    }
  if(!vendor?.isVerified){
    return res.status(500).send({message: "verify your mobile no."})
  }
 
    const match = await comparePassword(password,vendor?.password)

   if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid Password",
      });
    }
    
    const payload  = {_id : vendor._id,basicInfo : vendor.basicInfo,role : "vendor",venderID : vendor.venderID}
 
const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
    vendor.token = accessToken
    await vendor.save()

res.status(200).send({success: true, message: 'Logged in successfully',accessToken,plan});
} catch (error) {
    res.status(400).send({success: false, message: error.message });
                                                                                                                                                                                                                      
}
  }
  const   verifyOtpController = async (req,res) =>{
    try {
      const { otp } = req.body;
      const tempUser = req.otp;
      const vendor = await venderModel.findOne({"basicInfo.mobile" : tempUser.mobile});
      if(!vendor){
        return res.status(401).send({
          success:false,
          message:"Invalid mobile ",
          });
        }
      if (tempUser.otpExpires < Date.now()) {
       return res.status(400).send({success:false,message: "expired OTP"});
     }
    //  if (tempUser.basicInfo.mobile != mobile) {
    //    return res.status(400).send({success:false,message: "wrong mobile no."});
    //  }
     if (tempUser.otp != otp) {
       return res.status(400).send({success:false,message: "wrong OTP"});
     }
     if (!tempUser || tempUser.otp != otp || tempUser.otpExpires < Date.now()) {
       return res.status(400).send({success:false,message: "Invalid or expired OTP"});
     }  
     req.otp = null;
    // const {email,password} = req.body;
    // const vendor = await venderModel.findOne({"basicInfo.mobile" : tempUser.mobile});
    
    const plan = vendor?.basicInfo?.plan
   const paymentStatus = vendor?.paymentStatus
    
    if(!vendor?.isVerified){
      return res.status(500).send({message: "verify your mobile no."})
    }
   
    //   const match = await comparePassword(password,vendor?.password)
  
   const role="vendor"
      
      const payload  = {_id : vendor._id,basicInfo : vendor.basicInfo,role,venderID : vendor.venderID}
   
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });
      vendor.token = accessToken
      await vendor.save()
  
  res.status(200).send({success: true, message: 'Logged in successfully',accessToken,plan,role,paymentStatus});
  } catch (error) {
      res.status(400).send({success: false, message: error.message });                                                                                                                                                                                                                    
  }
    }
  const updateController = async(req,res)=>{
    try{
    const { basicInfo, companyDetail, bankDetail } = req.body;
    const updateData = {};

    if (basicInfo) {
      const { error } = vendorSchema.basicInfoSchema.validate(basicInfo);
      if (error) {
       return res.status(500).send({success: false,message : error.message})

      }
      updateData.basicInfo = { ...basicInfo };
    }
    if (companyDetail) {
      const { error } = vendorSchema.companyDetailSchema.validate(companyDetail);
      if (error) {
        return res.status(500).send({success: false,message : error.message})
      }
      updateData.companyDetail = { ...companyDetail };
    }

    if (bankDetail) {
      const { error } = vendorSchema.bankDetailSchema.validate(bankDetail);
      if (error) {
        return  res.status(500).send({success: false,message : error.message});
      }
      updateData.bankDetail = { ...bankDetail };
    }
    let updatedUser ;
    if(req.vendor.role === "subVendor") {
      updatedUser = await subVenderModel.findByIdAndUpdate(req.vendor._id, { $set: updateData }, { new: true }).select("-password -token").lean();
    }else{
      updatedUser =await venderModel.findByIdAndUpdate(req.vendor._id, { $set: updateData }, { new: true }).select("-password -token").lean();
    // const updatedUser = 
    }
    if (!updatedUser) {
     return res.status(400).send({success: false,message :"User not found"}) ;
    }
    if(!updatedUser.isVerified){
     return res.status(400).send({success: true,message :"User mobile is not verified"}) ;

    }
    res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
  } catch (error) {
    res.status(500).send({message : error.message})
  }
};
  
const getProfileController = async(req,res)=>{
  try {
    const vendorId = req.vendor?._id
    let profile ;
    if(req.vendor.role === "subVendor") {
       profile = await subVenderModel.findOne({_id : vendorId}).select("-password -token").lean()
    }else{
       profile = await venderModel.findOne({_id : vendorId}).select("-password -token").lean()
    }
     if(!profile){
      return res.status(400).send({success : false,message : "profile not found"})
     }
     return res.status(200).send({success : true,message : "get profile ",profile})

  } catch (error) {
    return res.status(400).send({success : false,message : error.message})

  }
}

const getAllvendorLoan = async(req,res)=>{ 
  try {
          const  vendorId  = req.vendor._id
  const loans = await loanModel.find({vendorId}).sort({ createdAt: -1 }).lean()
if(!loans){
  return res.status(500).send({success:false, message:" loan not found"});

}

  res.status(200).send({
    success : true,
    loans
  })
} catch (error) {
   res.status(500).send({success:false, message:error.message})
}
}
const uploadDocs = async(req,res)=>{
  try {
    const vendorId = req.vendor._id
  
    const files = req.files;
 
  const userDocs = {
    pic: files.pic ? files.pic[0].location : " ",
  };
  let user;
     if(req.vendor.role === "vendor"){
       user = await venderModel.findById(vendorId).select("-password");
      user.userdocs = userDocs
      await user.save()
     }else{
      user = await subVenderModel.findById(vendorId).select("-password");
      user.userdocs = userDocs
      await user.save()
     }
  if(!user){
    return res.status(400).send({success : false,message : "update failed"})
    }
    res.status(200).send({success : true,message : "update ",user})
  } catch (error) {
    res.status(400).send({success : false,message : error.message})
  }
}
const referralUpdate = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    console.log("wedf")
    const { referral } = req.body;

    console.log("Referral:", referral);

    // ✅ Correct way: pass vendorId directly + use $set for nested field
    const user = await venderModel.findByIdAndUpdate(
      vendorId,
    { 'basicInfo.referral': referral } ,
      { new: true, select: "-password" } // return updated doc & exclude password
    );

    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Update failed, user not found" });
    }

    res.status(200).send({
      success: true,
      message: "Referral updated successfully",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: error.message || "Server error" });
  }
};


const pendencyDocs = async(req,res)=>{
 try {
   const uploadedFiles = req.files
    const {loanId} = req.params
   const loan = await loanModel.findById(loanId)
  for (let fieldName in uploadedFiles) {
    if (fieldName) {
      loan.details.document[fieldName] = uploadedFiles[fieldName][0]?.location || " "; 
    }
  }
  loan.status.reason ="New Documents uploaded";
  loan.status.loanStatus = "Rework";
  await loan.save();
 await new statusHistoryModel({
      loanId:loanId,
      loanStatus:"Rework",
      reason:"New Documents uploaded",
    }).save()
    // console.log(loan , statusHistory)
  
  res.status(200).send({success : true,message : "update ",loan})
 } catch (error) {
  res.status(500).send({success : false,error : error.message});
 }
}
const resendOtp = async(req,res)=>{
 const {mobile} = req.body
 const otp = generateOTP()
 const otpExpires = Date.now() + 180000; // 2 min

 try {
    if (req.signUp && req.signUp.basicInfo.mobile == mobile) {
      req.signUp.otp = otp;
      req.signUp.otpExpires = otpExpires;
      const payload = req.signUp
      const newToken = jwt.sign(payload, process.env.SIGNUP_TOKEN_SECRET);

      await sendOTP(mobile, otp);
      res.status(200).send({success : true, message: 'OTP resent',newToken });
  } else {
      res.status(400).json({success : false, message: 'User not found or session expired' });
  }
   
  } catch (err) {
    res.status(500).send({success : false,error : err.message});
  }
}

const vPaymentHistoryController = async(req,res)=>{
  try {
    const mobile = req.vendor.basicInfo.mobile
    const payments = await paymentModel.find({mobile})
    if(!payments){
        return res.status(500).send({success:false,message:"No payment found" })
    }
    res.status(200).send({success:true,payments})
  } catch (error) {
    res.status(500).send({
        success: false,
        message: error.message,
  })
}}
const getNotification = async(req,res)=>{
  try {
    const vendorId = req.vendor._id
    const notifications = await notificationModel.find({vendorId}).sort({ createdAt: -1 }); // Sort by createdAt descending
    res.status(201).send({notifications});
  } catch (error) {
    res.status(500).send({success: false,message : error.message});
  }
}
const getId = async(req,res)=>{
  try {

    const id = req.vendor._id
    const venderID =req.vendor.venderID
    const mobile = req.vendor.basicInfo.mobile
    
     res.status(200).send({success:true ,id,venderID,mobile,message:"success" });

  } catch (error) {
    res.status(500).send({success:false ,message:error.message });

  }
}
const uploadIncVoiceLoan = async(req,res)=>{
  try{
  const files = req.files;
  const {loanId} = req.params

  const  uploadInvoice = files.uploadInvoice[0].location || " " 
const invoice =await loanModel.findByIdAndUpdate(loanId,{$set : {uploadInvoice}},{new : true})
if(!invoice){
  res.status(500).send({  
    success: false,
    message: "invoice not uploaded",
})
}
res.status(200).send({success:true,message:"Upload invoice successfully",invoice})
} catch (error) {
res.status(500).send({  
    success: false,
    message: error.message,
})


}}

const updateWallet = async(req,res)=>{
  try {
    // const 
    const {walletBalance} = req.body
    // const id = req.vendor._id
    const updatedWallet = await venderModel.findByIdAndUpdate(req.vendor._id,{$set : {walletBalance}},{new : true})
   if(!updatedWallet){
    res.status(400).send({success : false , message : "wallet not  update"})
   }
   res.status(200).send({success : true , message : "wallet update",updatedWallet}).select("-password");

  } catch (error) {
    res.status(400).send({success : false , message : error.message})

  }
}
const createShop = async(req,res)=>{
  try {
    const {shopName,personName,mobile,bankDetail,aadharDetails,pinCode,panDetails ,category} =req.body;
    const venderID = req.vendor.venderID
    const shopID = `SH${generateCardId()}`
    const shop = await shopModel.find({mobile})
  if(shop.length !== 0){
   res.status(500).send({success : false , message: "Shop already exists"})
  }
  const newShop= new shopModel({shopID,venderID,shopName,personName,category,mobile,bankDetail,aadharDetails,pinCode,panDetails})
  await newShop.save();
  res.status(200).send({success : true , message : "New shop created",newShop}) 
  } catch (error) {
    res.status(500).send({success : false, message : error.message})
  }

  }
  const getShop = async(req,res)=>{
    try {
      const venderID = req.vendor.venderID
            const shops = await shopModel.find({venderID})
      if(shops.length === 0){
        res.status(201).send({success : true , message : "No shops found"})
      }
      res.status(200).send({success : true , shops})
    } catch (error) {
      res.status(500).send({success : false , error : error.message})
    }
   
  }
  const getConnectors = async(req,res)=>{
  // console.log(req.vendor)
  try {
    const referral = req.vendor.venderID
const connectors = await subVenderModel.find({'basicInfo.referral':referral})
if(connectors.length >0){
 return res.status(200).send({success:true,message:"successfully fetch connectors",connectors})

}
return res.status(200).send({success:true,message:"No connectors",connectors})
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({success:false,message:"Internal Server Error"})

  }

  }
  const getPic  = async(req,res)=>{
    try {
      const getImg = await venderModel.find({}, { "userdocs.pic": 1, _id: 0 })
if(getImg) return res.status(200).send({success:true,message:"fetch image successfull",getImg})
    } catch (error) {
      console.log(error.message)
      res.status(500).send({success:false,message:error.message})
    }
    // console.log(getImg)
  }
  const getWalletHistory = async(req,res)=>{
    try {
      
      const history = await walletHistoryModel.find({vendorId:req.vendor.venderID}).sort({createdAt : -1}) 
      return res.status(200).send({success:true,message:"fetch image successfull",history})

    } catch (error) {
      console.log(error.message)
      res.status(500).send({success:false,message:error.message})
    }
    }
 const walletTopup = async(req, res)=>{
    try {
      const { amount } = req.body;
      const vendorId = req.vendor.venderID
      const vendorMongooseId= req.vendor._id
     
       await updateWalletAndLogHistory({
          vendorMongooseId,vendorId,
        amount,
        type: "credit",
        description: "Wallet Top-up",
      });
  
      res.status(200).json({
        success: true,
        message: "Wallet credited",
      
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
 
  
 }
  
 const getBlogDetails = async(req,res)=>{
  try {
      
    const {slug} = req.params
    // console.log(id)
    const blogDetails = await blogModel.findOne({slug:slug})
    // console.log(blogDetails)
    if(blogDetails){
      return res.status(200).send({success:true,message:"fetch image successfull",blogDetails})
    }   
return res.status(400).send({
  success:true,
  message: "No blogs found"
})
  } catch (error) {
    console.log(error.message)
    res.status(500).send({success:false,message:error.message})
  }
}
 const paidUpdateController = async(req,res)=>{
const {mobile,paymentStatus} = req.body
  if (!mobile || !paymentStatus) {
      return res.status(400).send({
        success: false,
        message: "Mobile and paymentStatus are required"
      });
    }
// console.log(req.body,mobile,paymentStatus)
 try {
  const updatedVendor = await venderModel.findOneAndUpdate(
      {"basicInfo.mobile":mobile},
      { $set: { paymentStatus } }, // Safe: Only updates paymentStatus
      { new: true } // Returns the updated document
    );
  if (!updatedVendor) {
      return res.status(404).send({
        success: false,
        message: "Vendor not found"
      });
    }
      const recipients = [
      { email:"corhaven.india@gmail.com"}
  ]; 
    const subject = "Vendor  vendor signup"
          const message = `We are excited to inform you that a new vendor has successfully signed up on the Rupay Lender platform. Below are the details of the new vendor:
    
     Vendor Details:
     - Vendor ID: ${updatedVendor?.venderID || " "}
     - Name: ${updatedVendor?.basicInfo?.username || " "}
     - Mobile Number: ${updatedVendor?.basicInfo?.mobile || " "}
     - Payment: ${updatedVendor?.paymentStatus || "paid"}`
     
    const htmlMessage = `<p>Dear Admin,</p>
               <p>We are excited to inform you that a new vendor has successfully signed up on the Rupay Lender platform. Below are the details of the new vendor:</p>
               <p><strong>Vendor Details:</strong></p>
               <ul>
                   <li><strong>Vendor ID:</strong> ${updatedVendor?.venderID || " "}</li>
                   <li><strong>Name:</strong> ${updatedVendor?.basicInfo?.username || " "}</li>
                   <li><strong>Mobile Number:</strong> ${updatedVendor?.basicInfo?.mobile || " "}</li>
                   <li> Payment: ${updatedVendor?.paymentStatus || "paid"}</li>
               </ul>`
     await sendEmail(subject,htmlMessage,message,recipients)
    if(updatedVendor) return res.status(200).send({success:true,message:"Signup Successfull"})
   } catch (error) {
  console.log(error.message)
      res.status(500).send({success:false,message:error.message})

 }
 }
   const getEvents = async(req,res)=>{
     try {
         
     const blog  = await blogModel.find({ type: "event" }).sort({ createdAt: -1 }).lean()
     if(!blog){
       return res.status(500).send({success : false, message : "blogs not found"})
     }
     res.status(200).send({success : true , message : " blog get successfully",blog})
 } catch (error) {
     res.status(500).send({success : false, message : error.message})
 }
   }
   const subsCribe = async(req,res)=>{
    try{
const {email} = req.body;
let  date = Date.now()
date  = dayjs(date).format("DD-MMM-YYYY")
// console.log(email,date)
const exist = await EventSubcriberModel.findOne({email})
// console.log(exist)
if(exist){
        return res.status(400).send({success : false ,status:400 ,message : "Already subscribed"})
}
const isSubcribe = true;
  const subscribe =    new EventSubcriberModel({email,date,isSubcribe})
  const recipients  = [{email}]
  await subscribe.save()
 const html =  await subscribeHTMLMessage()
 const text =  await subscribeMessage() 
 
  await sendEmail(subsCribeSubject,html,text,recipients)
       res.status(200).send({success : true , message : "subscribed successfully",subscribe})

    }catch(error){
      console.log(error.message)
     res.status(500).send({success : false, message : error.message})

    }
   }
const getSubscriber = async(req,res)=>{
try {
  const subscriber = await EventSubcriberModel.find({}).lean()
  if(!subscriber){
           res.status(500).send({success : false, message :"not any subscriber"})

  }
  res.status(200).send({success : true,message :"fetch subscriber",subscriber})
} catch (error) {
       res.status(500).send({success : false, message : error.message})

}
}
module.exports = {referralUpdate,getSubscriber,getEvents,subsCribe,paidUpdateController,getBlogDetails,walletTopup,getWalletHistory,getPic,getConnectors,verifyOtpController,getShop,createShop,updateWallet,uploadIncVoiceLoan,pendencyDocs,getId,getNotification,vPaymentHistoryController,resendOtp,uploadDocs,getAllvendorLoan,signUp,loginController,updateController,getProfileController}
