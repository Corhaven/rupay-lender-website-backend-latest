// personalLoanBalanceTransfer
const { adminModel } = require("../../admin/login");
const { generateLoanId } = require("../../helpers/otp");
const { notifyAdmin } = require("../../helpers/socket");
const loanModel = require("../../models/loanModel");
const { leadSubject, leadTextMessage, leadHtmlMessage } = require("../../helpers/messageMail");
const { sendEmail } = require("../../helpers/nodemailer");
const subAdmModel = require("../../models/subAdmModel");
const submitController = async(req,res)=>{
  try {
    const { personalDetail, professionalDetail, runningLoan} = req.body;
    const vendorId = req.vendor?._id
    const vendorInfo = req.vendor?.basicInfo
    if (!personalDetail || !professionalDetail || !runningLoan) {
      return res.status(400).json({
        error: 'personalDetail, professionalDetail, and runningLoan are required'
      });
    }
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
          closerLetter1 : files.closerLetter1[0].location || " ",
          closerLetter2 :files.closerLetter2[0].location || " ",
          closerLetter3 :files.closerLetter3[0].location || " "
        }
    
        const details = {
          personalDetail: JSON.parse(personalDetail),
          professionalDetail: JSON.parse(professionalDetail),
          runningLoan: JSON.parse(runningLoan),
          document: userDocs
        }
        const applicationID = `RUPL${generateLoanId()}`
        
        const loan = await new loanModel({
          vendorId,
          vendorInfo,
          applicationID,
      type : 'personal loan balance transfer',
      details
    }).save();
    const admin = await adminModel.find({});
    // console.log("admin",admin)
    notifyAdmin(admin[0]._id, 'loan subbmission',"personal Loan Balance Transfer submit");
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
    
    
    const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName,'personal loan balance transfer')
    const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName,'personal loan balance transfer')
    
    await sendEmail(leadSubject,html,text,recipients)

    res.status(201).json({
      success : true,
      message: ' personal Loan Balance Transfer details added successfully',
      loan
    });
  } catch (error) {
    res.status(500).json({success : false, error: error.message });
  }

}
const getAllpersonalloanBalancetransfer = async(req,res)=>{
  try {
    const vendorId = req.vendor._id;
    // console.log(vendorId)
    const loans = await loanModel.find({
      type :
      "personal loan balance transfer"
      })
    // console.log(loans)
    res.status(200).send({
      success : true,
      loans
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).send({success : false,message : error.message})
  }
 
}
module.exports = {submitController,getAllpersonalloanBalancetransfer};

