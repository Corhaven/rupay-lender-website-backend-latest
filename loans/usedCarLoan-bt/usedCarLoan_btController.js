// const { adminModel } = require("../../admin/login");
const { adminModel } = require("../../admin/login");
const { generateLoanId } = require("../../helpers/otp");
const { notifyAdmin } = require("../../helpers/socket");
const loanModel = require("../../models/loanModel");
const { leadSubject, leadTextMessage, leadHtmlMessage } = require("../../helpers/messageMail");
const { sendEmail } = require("../../helpers/nodemailer");
const subAdmModel = require("../../models/subAdmModel");
const submitJobController = async(req,res)=>{
    try{
const { personalDetail, carDetail,professionalDetail ,runningLoan} = req.body

if (!personalDetail || !carDetail || !professionalDetail || !runningLoan) {
  return res.status(400).json({
    error: 'personalDetail ,carDetail, professionalDetail,runningCarLoan and runningLoan are required'
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
// const runningCarLoans= JSON.parse(runningCarLoan)

// let runningCarLoanDetails = {}; 

// if (runningCarLoans.runningCarLoan === "yes") {
//   runningCarLoanDetails = {
//     runningCarLoans: runningCarLoans,
//     sanctionLetter: files ? (files.sanctionLetter[0]?.location || " ") : " "
//   };
// }

const vendorId = req.vendor?._id
const vendorInfo = req.vendor?.basicInfo
    const userDocs = { 
    panCard : files.panCard[0].location || " " ,
  aadharfront : files.aadharfront[0].location || " " ,
aadharback : files.aadharback[0].location || " " ,
payslip1 : files.payslip1[0].location || " " ,

payslip2 : files.payslip2[0].location || " " ,
payslip3 : files.payslip3[0].location || " " ,
sevenMonthStatement : files.sevenMonthStatement[0].location || " " ,

insurancePolicy : files.insurancePolicy[0].location || " ",
rc :files.rc[0].location || " ",
// runningCarLoanDetail:runningCarLoanDetails
sanctionLetter :files.sanctionLetter[0].location || " "
}

    const details = {
      personalDetail: JSON.parse(personalDetail),

      carDetail: JSON.parse(carDetail),
      professionalDetail: JSON.parse(professionalDetail),
      runningLoan: JSON.parse(runningLoan),
      document: userDocs
    }
    const applicationID = `RUPL${generateLoanId()}`
    
    const loan = await new loanModel({
      vendorId,
      vendorInfo,
      applicationID,
  type : 'used car loan bt',
  details
}).save();
const admin = await adminModel.find({});
// console.log("admin",admin)
notifyAdmin(admin[0]._id, 'loan subbmission',"home loan submit");
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


const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName,'used car loan bt')
const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName,'used car loan')

await sendEmail(leadSubject,html,text,recipients)
res.status(201).json({
  success : true,
    message: 'used car loan details added successfully',
    loan
  });
} catch (error) {
  console.log(error)
  res.status(500).json({success : false, error: error.message });
}
}

const submitBusinessController = async(req,res)=>{
  try{
    const { personalDetail, carDetail,professionalDetail ,runningLoan} = req.body
    
    if (!personalDetail || !carDetail || !professionalDetail || !runningLoan) {
      return res.status(400).json({
        error: 'personalDetail ,carDetail, professionalDetail,runningCarLoan and runningLoan are required'
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
    // const runningCarLoans= JSON.parse(runningCarLoan)

    // let runningCarLoanDetails = {}; 
    
    // if (runningCarLoans.runningCarLoan === "yes") {
    //   runningCarLoanDetails = {
    //     runningCarLoans: runningCarLoans,
    //     sanctionLetter: files ? (files.sanctionLetter[0]?.location || " ") : " "
    //   };
    // }
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
      insurancePolicy : files.insurancePolicy[0].location || " ",
      rc :files.rc[0].location || " ",
      // runningCarLoanDetail:runningCarLoanDetails
      sanctionLetter :files.sanctionLetter[0].location || " "
    }
    

        const details = {
          personalDetail: JSON.parse(personalDetail),  
          carDetail: JSON.parse(carDetail),
          professionalDetail: JSON.parse(professionalDetail),
          runningLoan: JSON.parse(runningLoan),
          document: userDocs
        }   
        const applicationID = `RUPL${generateLoanId()}`

    const loan = await new loanModel({
      vendorId,
      vendorInfo,
      applicationID,
      type : 'used car loan bt',
      details
    }).save();
    const admin = await adminModel.find({});
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


const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName,'used car loan bt')
const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName,'used car loan bt')

await sendEmail(leadSubject,html,text,recipients)
notifyAdmin(admin[0]._id, 'loan subbmission',"'used car loan' submit");
    res.status(201).json({
      success : true,
        message: 'Used Car loan details added successfully',
        loan
      });
    } catch (error) {
      res.status(500).json({success : false, error: error.message });
    }
}


module.exports = {submitJobController,submitBusinessController}