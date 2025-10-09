const { adminModel } = require("../../admin/login");
const { generateLoanId } = require("../../helpers/otp");
const { notifyAdmin } = require("../../helpers/socket");
const loanModel = require("../../models/loanModel");
const { leadSubject, leadTextMessage, leadHtmlMessage } = require("../../helpers/messageMail");
const { sendEmail } = require("../../helpers/nodemailer");
const subAdmModel = require("../../models/subAdmModel");
const submitController = async(req,res)=>{
    try{
const {personalDetail,propertyDetail,professionalDetail ,runningLoan} = req.body

if (!personalDetail || !propertyDetail || !professionalDetail || !runningLoan) {
  return res.status(400).json({
    error: 'personalDetail,propertyDetail, professionalDetail, and runningLoan are required'
  });
}
const vendorId = req.vendor?._id;
const vendorInfo = req.vendor?.basicInfo 

const files = req.files;
    const userDocs = { 
      panCard : files.panCard[0].location || " " ,
      aadharfront : files.aadharfront[0].location || " " ,
      aadharback : files.aadharback[0].location || " " ,
      payslip1 : files.payslip1[0].location || " " ,

      payslip2 : files.payslip2[0].location || " " ,
      payslip3 : files.payslip3[0].location || " " ,
      sevenMonthStatement : files.sevenMonthStatement[0].location || " " ,
      form16 : files.form16[0].location || " " ,
      form26 :files.form26[0].location || " ",
      propertyChain : files.propertyChain[0].location || " ",
      map :files.map[0].location || " ",
      // sanctionLetter :files.sanctionLetter[0].location || " "

    }
    const details = {
      personalDetail: JSON.parse(personalDetail),

      propertyDetail: JSON.parse(propertyDetail)
      ,professionalDetail: JSON.parse(professionalDetail),
      runningLoan: JSON.parse(runningLoan),
      document: userDocs}
      const applicationID = `RUPL${generateLoanId()}`
      const loan = await new loanModel({
        vendorId,
        vendorInfo,
        applicationID,
  type : 'loan against property',
  details
}).save();
const admin = await adminModel.find({});
    notifyAdmin(admin[0]._id, 'loan subbmission',"loan Against Property submit");
    const recipients = [
      { email:"corhaven.india@gmail.com"},
    ];
    const referral = req.vendor?.basicInfo?.referral
    
    let subAdminName = "direct lead";
    if(referral && referral.length > 4){
            const subAdm = await subAdmModel.find({referral})
            subAdminName = subAdm[0]?.username;
      subAdm.forEach(subAdm => {
        if (subAdm.email) {
            recipients.push({ email: subAdm.email });
        }
    });
    }
    
    
    const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName,'loan against property')
    const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName,'loan against property')
    
    await sendEmail(leadSubject,html,text,recipients)

res.status(200).json({
  success : true,
    message: 'loan Against Property details added successfully',
    
    loan
  });
} catch (error) {
  res.status(500).json({ error: error.message });
}
}

const submitBusinessController = async(req,res)=>{
  try{
    const { personalDetail, propertyDetail,professionalDetail ,runningLoan} = req.body
    
    if (!personalDetail || !propertyDetail || !professionalDetail || !runningLoan) {
      return res.status(400).json({
        error: 'personalDetail ,propertyDetail, professionalDetail, and runningLoan are required'
      });
    }
    const files = req.files;
    const vendorId = req.vendor?._id
    const vendorInfo = req.vendor?.basicInfo
 
    
    const userDocs = { 
      panCard : files.panCard[0].location || " " ,
      aadharfront : files.aadharfront[0].location || " " ,
      aadharback : files.aadharback[0].location || " " ,
      gstMsmeCerificate : files.gstMsmeCerificate[0].location || " " ,

      itrComution1 : files.itrComution1[0].location || " " ,
      itrComution2 : files.itrComution2[0].location || " " ,
      itrComution3 : files.itrComution3[0].location || " " ,
      oneBankStatementCurrentAccount : files.oneBankStatementCurrentAccount[0].location || " " ,
      oneYearSavingAccountStatement :files.oneYearSavingAccountStatement[0].location || " ",
      propertyChain : files.propertyChain[0].location || " ",
      map :files.map[0].location || " "
      // sanctionLetter :files.sanctionLetter[0].location || " "

    }
    

        const details = {
          personalDetail: JSON.parse(personalDetail),  
          propertyDetail: JSON.parse(propertyDetail),
          professionalDetail: JSON.parse(professionalDetail),
          runningLoan: JSON.parse(runningLoan),
          document: userDocs
        }   
        const applicationID = `RUPL${generateLoanId()}`
        const loan = await new loanModel({
          vendorId,
          vendorInfo,
          applicationID,
      type : 'loan against property',
      details
    }).save();
    const recipients = [
      { email:"corhaven.india@gmail.com"},
    ];
    const referral = req.vendor?.basicInfo?.referral
    
    let subAdminName = "direct lead";
    if(referral && referral.length > 4){
            const subAdm = await subAdmModel.find({referral})
            subAdminName = subAdm[0]?.username;
      subAdm.forEach(subAdm => {
        if (subAdm.email) {
            recipients.push({ email: subAdm.email });
        }
    });
    }
    
    
    const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName,'loan against property')
    const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName,'loan against property')
    
    await sendEmail(leadSubject,html,text,recipients)
    res.status(201).json({
      success : true,
        message: 'loan against property details added successfully',
        loan
      });
    } catch (error) {
      res.status(500).json({success : false, error: error.message });
    }
}
module.exports = {submitController,submitBusinessController}