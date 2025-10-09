const { adminModel } = require("../../admin/login");
const { leadSubject, leadTextMessage, leadHtmlMessage } = require("../../helpers/messageMail");
const { sendEmail } = require("../../helpers/nodemailer");
const { generateLoanId } = require("../../helpers/otp");
const { notifyAdmin } = require("../../helpers/socket");
const loanModel = require("../../models/loanModel");
const subAdmModel = require("../../models/subAdmModel");



const submitController = async(req,res)=>{
  try {
    const { personalDetail, professionalDetail, runningLoan} = req.body;

const applicationID = `RUPL${generateLoanId()}`  
 
if (!personalDetail || !professionalDetail || !runningLoan) {
  return res.status(400).json({
    error: ' professionalDetail,propertyDetail , and runningLoan are required'
  });
}
const vendorId = req.vendor?._id
const vendorInfo = req.vendor?.basicInfo
const files = req.files;
      //  console.log("req.files",req.files)
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
      // propertyChain : files.propertyChain[0].location || " ",
      // map :files.map[0].location || " ",
    }

    const details = {
      personalDetail: JSON.parse(personalDetail),
      professionalDetail: JSON.parse(professionalDetail),
      runningLoan: JSON.parse(runningLoan),
      document: userDocs
    }
  
    const loan = await new loanModel({
      vendorId,
      vendorInfo,
      applicationID,
      type : 'business loan',
      details
    }).save();
    const recipients = [
      { email:"corhaven.india@gmail.com"},
  ];
  const referral = req.vendor.basicInfo.referral

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


const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName,'business loan')
const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName,'business loan')

await sendEmail(leadSubject,html,text,recipients)

    notifyAdmin(vendorId, 'loan subbmission',"business loan submit");
    res.status(201).json({
      success : true,
      message: 'business loan details added successfully',
      loan
    });
  } catch (error) {
    res.status(500).json({success : false, error: error.message });
  }

}
const businessLoanController = async(req,res)=>{
  try {
    const vendorId = req.vendor._id;
    // console.log(vendorId)
    const loans = await loanModel.find({
      type :
      "business loan"
      }).lean()
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
module.exports = {submitController,businessLoanController};
