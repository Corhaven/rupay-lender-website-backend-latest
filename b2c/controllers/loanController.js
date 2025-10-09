const { default: axios } = require("axios");
const { generateLoanId, generateOTP, sendOTP, generateReferralCode } = require("../../helpers/otp");
const loanInquiryModel = require("../model/loanInquiryModel");
const jwt = require("jsonwebtoken");
const b2cStatusHistoryModel = require("../model/b2cStatusHistoryModel");
const Customer = require("../model/customerModel");
const { b2cLeadHtmlMessage, b2cLeadTextMessage, leadSubject } = require("../../helpers/messageMail");
const { sendEmail } = require("../../helpers/nodemailer");
const { sendSms } = require("../../helpers/message");
const faqInquiryModel = require("../model/faqInquiryModel");

const inquiryId = (type)=>{
    switch (type) {
      case "personal loan":
       return 'PL';
        case 'personal loan balance transfer' :
        return 'PL'
         case "loan against property":
        return 'LAP'
       case 'loan against property bt' :
        return 'LAP'
  case "education loan":
        return 'EL'
      case "home loan":
        return 'HL'
            case "home loan balance transfer":
        return 'HL'
    
      case "business loan":
        return 'BL'
        case "motor insurance":
        return 'MI'
         case "web dev":
          return 'WD'
          case "social media" :
            return 'SM'
            case "graphic design":
              return "GD"
              case "professional loan":
              return "PRL"
              case "used car loan":
                return "UCL"
      default:
        return 'CC'
    }
    } 
const loanController = async(req,res)=>{
     try {
         let {type,mobile,pincode,referred,shopID,whatsUppOpt} = req.body;
    
        if(referred){
          const user = await Customer.find({mobile,referral : referred})
          if(user 
            && user.length !== 0){
             return res.status(400).send({success : false,message: "You can not use refferal"})
            }
        }
        const {data} =await axios.get(`https://api.postalpincode.in/pincode/${pincode}`)
        const district = data[0]?.PostOffice[0]?.District;
        const state = data[0]?.PostOffice[0]?.State;

        const applicationID = `${inquiryId(type)}${generateLoanId()}`
        const otp = generateOTP();
        const otpExpires = Date.now() + 180000; // 2 min
  
       const payload = {...req.body,applicationID,otp,district,state, otpExpires,shopID,whatsUppOpt}
        const inquiryToken = jwt.sign(payload, process.env.INQUIRY_TOKEN, { expiresIn: '1h' });
        const dataotp = await sendOTP(mobile, otp);
       if(dataotp.Status === 'Success'){
        
        return res.status(200).send({success: true,
          message: "Otp sent Successfully",inquiryToken})
       }

        res.status(500).send({success : false,message :"Inquiry is not submitted"})
    //    }
    } catch (error) {
        res.status(400).send({success: false, message: error.message });                                                                                                                                                                                                                      
    }
   }
const inquiryVerify = async (req, res) => {
    try {
      const { mobile, otp } = req.body;
    // console.log(req.body)
      const tempUser = req.inquiry;
     // console.log(tempUser)
    let {username,state,district,whatsUppOpt,email,type} =tempUser
    console.log("sdf",username,state,district,whatsUppOpt,email,type)
       if (tempUser.otpExpires < Date.now()) {
        return res.status(400).send({success:false,message: "expired OTP"});
      }
     
      if (tempUser.otp != otp) {
        return res.status(400).send({success:false,message: "wrong OTP"});
      }
       const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
        
        const existingInquiry = await loanInquiryModel.findOne({
            mobile: mobile,
            type: type,
            createdAt: { $gte: fifteenDaysAgo }
        });
let duplicateInquiry = false;
        if(existingInquiry) {
            duplicateInquiry = true;
        }
      const user = await Customer.find({mobile})
      if(!user 
        || user.length === 0){
        referral =  generateReferralCode()
        const customer = new Customer({referral,mobile,email,username,state,district,whatsUppOpt})
        await customer.save()
  
      }
// console.log(...tempUser,duplicateInquiry)
      const loanInquiry = new loanInquiryModel({...tempUser,duplicateInquiry}) 
      
      await loanInquiry.save()
     
  
        const { _id, applicationID, referred} = loanInquiry;
        // console.log(applicationID,username,type)
        const text =await b2cLeadTextMessage(applicationID,username,type)
        const html =await b2cLeadHtmlMessage(applicationID,username,type)
         const message = `Thank you for submitting your application with Rupay Lender. Your application ID is ${applicationID}. Our team will contact you within 24 hours. Check your application updates at https://rupaylender.com/login`
        await sendSms(message,mobile)
        // await sendSMS(mobile,message)
        const recipients = [
          { email:"corhaven.india@gmail.com"},
        ];
         
        await sendEmail(leadSubject,html,text,recipients)
           const statusHistory = new b2cStatusHistoryModel({inquiryId:_id,applicationID, username, mobile, type,referred
      })
      await statusHistory.save() 
      req.inquiry = null;
       res.status(200).send({success:true,message:  "inquiry submitted",loanInquiry})
    } catch (error) {
       res.status(500).send({success: false,message: error.message})
    }
   };
  const resendOtp = async(req,res)=>{
    const {mobile} = req.body
    const otp = generateOTP()
    const otpExpires = Date.now() + 180000; // 2 min
    try {
       if (req.inquiry && req.inquiry.mobile == mobile) {
         req.inquiry.otp = otp;
         req.inquiry.otpExpires = otpExpires;
         const payload = req.inquiry
         const newToken = jwt.sign(payload, process.env.INQUIRY_TOKEN);
   
         await sendOTP(mobile, otp);
         res.status(200).send({success : true, message: 'OTP resent',newToken });
     } else {
         res.status(400).json({success : false, message: 'User not found or session expired' });
     }
      
     } catch (err) {
       res.status(500).send({success : false,error : err.message});
     }
   } 
   const getInquiries = async(req,res)=>{
    try {
        const inquiries = await loanInquiryModel.find()
        if(!inquiries){
            res.status(500).send({success : false, message :"Inquiries not geting"})
    
        }
        res.status(200).send({success : true, message :"Inquiries get successfully ",inquiries})  
    } catch (error) {
        res.status(500).send({success : false,error : err.message});
 
    }

   } 
   const faqsInquiry = async(req,res)=>{
    try {
      const {name, email,mobile,message} = req.body;
      console.log(req.body)
// const inquiry  = new faqInquiryModel({name, email,mobile,message})
// await inquiry.save();
// console.log(inquiry)
 return res.status(200).json({
      success: true,
      message: "Inquiry submitted successfully",
      // inquiry,
    });
    } catch (error) {
       res.status(500).send({success: false,message: error.message})
    }
   }
module.exports = {loanController,inquiryVerify,resendOtp,getInquiries,faqsInquiry}