// const { leadTextMessage, leadHtmlMessage, leadSubject } = require("../../helpers/messageMail");
// const { sendEmail } = require("../../helpers/nodemailer");
const { default: mongoose } = require("mongoose");
const { sendOTP, generateOTP, generateLoanId } = require("../../helpers/otp");
const loanModel = require("../../models/loanModel");
const wfhmodel = require("../model/wfhmodel");
const jwt = require("jsonwebtoken");
const Customer = require("../../b2c/model/customerModel");
const venderModel = require("../../models/venderModel");
const subVenderModel = require("../../models/subVenderModel");
const telecallers = async(req,res)=>{
    const {  
    name,mobile,email,city,state ,pinCode,product,address,whatsUppOpt,referral
 } = req.body
    if(!name && !mobile && !email ){
        return res.status(400).send({message: "Please fill required the fields" })
    }
    const cv = req?.files?.cv[0]?.location || ""
    const venderID = `TC${generateLoanId()}` 
    // console.log(venderID)
    const application = new wfhmodel({name,mobile,email,city,state,address ,pinCode,product,role:"telecaller",venderID,cv,whatsUppOpt,referral});
    
    // Save the application
    const savedApplication = await application.save();
    
    res.status(201).send({
        success: true,
        message: 'Application submitted successfully',
        data: savedApplication
    });
    }
const getProfile = async(req,res)=>{
// const 
try {
   const profile = await wfhmodel.findOne({mobile:req.vendor.vendorInfo.mobile})
   if(profile.length !=0){

       res.status(200).send({
           success:true,
           message:"fetch profile",
           profile
        }) 
    }
} catch (error) {
 console.log(error.message) 
  res.status(500).send({success: false,message: error.message})  
}


console.log(req.vendor)
}
    const verifyOtp = async(req,res)=>{
        const { OTP } = req.body;
        const {mobile,otp,otpExpires} = req.otp;
      
        if (otp === OTP && Date.now() < otpExpires) {
        
            const telecaller = await wfhmodel.find({mobile})
     
            if(telecaller.length === 0 ){
                return res.status(500).send({success : false , message : "Error Occured"})
            }
            Info ={
            username : telecaller[0].name,
         email :telecaller[0].email,
        mobile : telecaller[0].mobile,
        state: telecaller[0].state,
        city:telecaller[0].city,
        referral:"telecaller",
        qualification : " ",
        address :telecaller[0].address,
            }
            const accessToken = jwt.sign({ _id: telecaller._id, vendorInfo: Info, role: "telecaller" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
                  // console.log(token)
                  res.status(200).send({success:true ,accessToken,message:"success",venderID : telecaller[0].venderID });
        //   res.status(200).send({ success: true, message: "Logged In" });
        } else {     
          res.status(500).send({ success: false, message: "Invalid or expired OTP" });
        } 
    }
    const sendOtp = async(req,res)=>{
        try{
        const {mobile,type} = req.body
let exists;
        switch (type) {
            case "wfh":
                exists = await wfhmodel.findOne({ mobile: mobile });
                break;
            case "customer":
              exists = await Customer.findOne({ mobile: mobile });
              break;
              case "vendor":
                exists = await venderModel.findOne({ 'basicInfo.mobile': mobile });
                break;
            default:
              exists = await subVenderModel.findOne({ 'basicInfo.mobile': mobile });
              break;
          }
    
//    console.log(exists)

   if(!exists){
    return res.status(400).send({success:false,message:`${type === "wfh"? "Tellecaller": type} not found, try another number or contact us`})
   }

        const otp = generateOTP();
    
        const otpExpires = Date.now() + 300000; 
        const payload = {
            mobile, otp , otpExpires 
        }
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
    
    }}
    // const personalLoanController = async(req,res)=>{
    //     try {
    //         const { personalDetail, professionalDetail, runningLoan} = req.body;
    //         const {mobile} = req.params
       
        
    //       if (!personalDetail || !professionalDetail || !runningLoan) {
    //         return res.status(400).send({
    //           error: 'personalDetail, professionalDetail, and runningLoan are required',     
    //         });
    //       }
    //       const files = req.files;
         
    //       const userDocs = { 
    //         panCard : files?.panCard[0]?.location || " " ,
    //         aadharfront : files?.aadharfront[0]?.location || " " ,
    //         aadharback : files?.aadharback[0]?.location || " " ,
    //         payslip1 : files?.payslip1[0]?.location || " " ,
      
    //         payslip2 : files?.payslip2[0]?.location || " " ,
    //         payslip3 : files?.payslip3[0]?.location || " " ,
    //         sevenMonthStatement : files?.sevenMonthStatement[0]?.location || " " ,
    //       }
          
    //       const details = {
    //         personalDetail: JSON.parse(personalDetail),
    //         professionalDetail: JSON.parse(professionalDetail),
    //         runningLoan: JSON.parse(runningLoan),
    //         document: userDocs
    //       }
          
    //       const telecaller = await wfhmodel.find({mobile})
    
    //       const vendorId = telecaller[0]?._id
        
    //       const vendorInfo = { username : telecaller[0].name,
    //         email :telecaller[0].email,
    //         mobile : telecaller[0].mobile,
    //         state: telecaller[0].state,
    //         city:telecaller[0].city,
    //         referral:"telecaller",
    //         qualification : " ",
    //         address :telecaller[0].address,
    //     }
    //       const applicationID = `RUPL${generateLoanId()}`
    //       const loan = await new loanModel({
    //         vendorId,
    //         applicationID,
    //         vendorInfo,
    //         type : 'personal loan',
    //         details
    //       }).save();
      
    //       const recipients = [
    //         { email:"corhaven.india@gmail.com"},
    //       ];
          
     
    
    //       const text =await leadTextMessage(applicationID,details.personalDetail.username,"telecaller",'personal loan')
    //       const html =await leadHtmlMessage(applicationID,details.personalDetail.username,"telecaller",'personal loan')
          
    //       await sendEmail(leadSubject,html,text,recipients)
      
    //       // notifyAdmin(admin[0]._id, 'loan subbmission',"Personal loan submit");
    //       res.status(201).json({
    //         success : true,
    //           message: 'Personal loan details added successfully',
    //           loan
    //         });  
       
    //     } catch (error) {
    //       res.status(500).json({ error: error.message });
    //     }
    // }
    const getLoans = async(req,res)=>{                                                      
     const loans = await loanModel.find({'role': "telecaller",'vendorInfo.mobile':req.vendor.vendorInfo.mobile})
     if(!loans) {
        return res.status(500).send({success : false,message : "No loan found"})
        }
   if(loans.length == 0) {
    return   res.status(200).send({success : true,message : "No loan found"})
    }
  res.status(200).send({success : true,message : "get loan",loans})
    }

   module.exports = {getLoans,telecallers,verifyOtp,sendOtp,getProfile}

  