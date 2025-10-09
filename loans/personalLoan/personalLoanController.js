// const {documentModel} = require("../../models/documentModel");
// const { adminModel } = require("../../admin/login");
const { adminModel } = require("../../admin/login");
const { sendEmail } = require("../../helpers/nodemailer");
const { leadSubject, leadTextMessage, leadHtmlMessage } = require("../../helpers/messageMail");
const { generateLoanId } = require("../../helpers/otp");
const { notifyAdmin } = require("../../helpers/socket");
const loanModel = require("../../models/loanModel");
const subAdmModel = require("../../models/subAdmModel");


//

const submitController = async(req,res)=>{
  try {
    const { personalDetail, professionalDetail, runningLoan} = req.body;
 if (!personalDetail || !professionalDetail || !runningLoan) {
      return res.status(400).json({
        error: 'personalDetail, professionalDetail, and runningLoan are required'
      });
    }
    const loans = await loanModel.find({
      'details.personalDetail.mobile': Number(JSON.parse(personalDetail).mobile)
    });
    if(loans.length !== 0){
          return res.status(400).json({
        error: 'mobile no. file already in loan'})
    }
    const files = req.files;
    const vendorId = req.vendor?._id
    const vendorInfo = req.vendor?.basicInfo 
      // console.log(vendorInfo)  
    const userDocs = {  
      panCard : files.panCard[0].location || " " ,
      aadharfront : files.aadharfront[0].location || " " ,
      aadharback : files.aadharback[0].location || " " ,
      payslip1 : files.payslip1[0].location || " ",
      payslip2 : files.payslip2[0].location || " ",
      payslip3 : files.payslip3[0].location || " " ,
      sevenMonthStatement : files.sevenMonthStatement[0].location || " ",
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
      applicationID,
      vendorInfo,
      type : 'personal loan',
      details
    }).save();
    // const admin = await adminModel.find({});
    // console.log("admin",admin)
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
    const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName,'personal loan')
    const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName,'personal loan')
    
    await sendEmail(leadSubject,html,text,recipients)

    // notifyAdmin(admin[0]._id, 'loan subbmission',"Personal loan submit");
    res.status(201).json({
      success : true,
        message: 'Personal loan details added successfully',
        loan
      });  
 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getAllpersonalLoan = async(req,res)=>{
  try{
  // const vendorId = req.vendor._id;
  const loans = await loanModel.find({type : 'personal loan'})
  
  res.status(200).send({
    success : true,
    loans
  })
} catch (error) {
  console.log(error.message)
  res.status(500).send({success : false,message : error.message})
}
}


module.exports = {getAllpersonalLoan,submitController};

