// const { adminModel } = require("../../admin/login");
const { adminModel } = require("../../admin/login");
const { leadTextMessage, leadHtmlMessage, leadSubject } = require("../../helpers/messageMail");
const { generateLoanId } = require("../../helpers/otp");
const { notifyAdmin } = require("../../helpers/socket");
const loanModel = require("../../models/loanModel");
const { sendEmail } = require("../../helpers/nodemailer");
const subAdmModel = require("../../models/subAdmModel");

const submitJobController = async(req,res)=>{
    try{
const { personalDetail, propertyDetail,professionalDetail ,runningLoan} = req.body
const applicationID = `RUPL${generateLoanId()}`

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
payslip1 : files.payslip1[0].location || " " ,

payslip2 : files.payslip2[0].location || " " ,
payslip3 : files.payslip3[0].location || " " ,
sevenMonthStatement : files.sevenMonthStatement[0].location || " " ,
form16 : files.form16[0].location || " " ,
form26 :files.form26[0].location || " ",
propertyChain : files.propertyChain[0].location || " ",
map :files.map[0].location || " "

}

    const details = {
      personalDetail: JSON.parse(personalDetail),

      propertyDetail: JSON.parse(propertyDetail),
      professionalDetail: JSON.parse(professionalDetail),
      runningLoan: JSON.parse(runningLoan),
      document: userDocs
    }
  

const loan = await new loanModel({
  vendorId,
  vendorInfo,
  applicationID,
  type : 'home loan',
  details
}).save();
const admin = await adminModel.find({});
// console.log("admin",admin)\
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


const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName,'home loan')
const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName,'home loan')

await sendEmail(leadSubject,html,text,recipients)

notifyAdmin(admin[0]._id, 'loan subbmission',"home loan submit");
res.status(201).json({
  success : true,
    message: 'Home loan details added successfully',
    loan
  });
} catch (error) {
  console.log(error)
  res.status(500).json({success : false, error: error.message });
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
      map :files.map[0].location || " ",
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
      type : 'home loan',
      details
    }).save();
    const admin = await adminModel.find({});
    const recipients = [
      { email:"corhaven.india@gmail.com"},
    ];
    const referral = req.vendor.basicInfo?.referral
    
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
    
    
    const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName,'home loan')
    const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName,'home loan')
    
    await sendEmail(leadSubject,html,text,recipients)
// console.log("admin",admin)
notifyAdmin(admin[0]._id, 'loan subbmission',"home loan submit");
    res.status(201).json({
      success : true,
        message: 'Home loan details added successfully',
        loan
      });
    } catch (error) {
      res.status(500).json({success : false, error: error.message });
    }
}


module.exports = {submitJobController,submitBusinessController}