const wfhmodel = require("../carrier/model/wfhmodel");
const { leadTextMessage, leadHtmlMessage, leadSubject } = require("../helpers/messageMail");
const { sendEmail } = require("../helpers/nodemailer");
const { generateLoanId } = require("../helpers/otp");
const loanModel = require("../models/loanModel");
const subAdmModel = require("../models/subAdmModel");
const venderModel = require("../models/venderModel");

const personalLoanbtController = async(req,res)=>{
    try {
      const { personalDetail, professionalDetail, runningLoan} = req.body;
      const {mobile} = req.params
      if (!personalDetail || !professionalDetail || !runningLoan) {
        return res.status(400).json({
          error: 'personalDetail , professionalDetail, and runningLoan are required'
        });
      }
//   console.log(vendorId)
let vendorId ,vendorInfo, referral;
if(req.vendor.role == "telecaller"){
   const telecaller = await wfhmodel.find({mobile})
    
           vendorId = telecaller[0]?._id
        
           vendorInfo = { username : telecaller[0].name,
            email :telecaller[0].email,
            mobile : telecaller[0].mobile,
            state: telecaller[0].state,
            city:telecaller[0].city,
            referral:"telecaller",
            qualification : " ",
            address :telecaller[0].address,
        }
}else{
  const vendor = await venderModel.find({"basicInfo.mobile" : mobile})
 vendorId = vendor[0]?._id
   vendorInfo = vendor[0]?.basicInfo 
   referral = vendor[0]?.basicInfo?.referral
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
// const admin = await adminModel.find({});
// console.log("admin",admin)\
const recipients = [
  { email:"corhaven.india@gmail.com"},
];
// const referral = req.vendor?.basicInfo?.referral
let subAdminName ;

if(req.vendor.role != "telecaller"){
   subAdminName  = "direct lead"
  if(referral && referral.length > 4){
    const subAdm = await subAdmModel.find({referral})
    subAdminName = subAdm[0]?.username;
subAdm.forEach(subAdm => {
if (subAdm.email) {
    recipients.push({ email: subAdm.email });
}
});
}
}
  
      const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'personal loan balance transfer')
      const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'personal loan balance transfer')
      
         
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

  const personalLoanController = async(req,res)=>{
    try {
        const { personalDetail, professionalDetail, runningLoan} = req.body;
        const {mobile} = req.params
   
    
      if (!personalDetail || !professionalDetail || !runningLoan) {
        return res.status(400).send({
          error: 'personalDetail, professionalDetail, and runningLoan are required',     
        });
      }
      const files = req.files;
     
      const userDocs = { 
        panCard : files?.panCard[0]?.location || " " ,
        aadharfront : files?.aadharfront[0]?.location || " " ,
        aadharback : files?.aadharback[0]?.location || " " ,
        payslip1 : files?.payslip1[0]?.location || " " ,
  
        payslip2 : files?.payslip2[0]?.location || " " ,
        payslip3 : files?.payslip3[0]?.location || " " ,
        sevenMonthStatement : files?.sevenMonthStatement[0]?.location || " " ,
      }
      
      const details = {
        personalDetail: JSON.parse(personalDetail),
        professionalDetail: JSON.parse(professionalDetail),
        runningLoan: JSON.parse(runningLoan),
        document: userDocs
      }
      let vendorId ,vendorInfo, referral;
      let role;
if(req.vendor.role == "telecaller"){
     role="telecaller";
   const telecaller = await wfhmodel.find({mobile})
    
           vendorId = telecaller[0]?._id
        
           vendorInfo = { username : telecaller[0].name,
            email :telecaller[0].email,
            mobile : telecaller[0].mobile,
            state: telecaller[0].state,
            city:telecaller[0].city,
            referral:telecaller[0].referral,
            qualification : " ",
            address :telecaller[0].address,
        }
}else{
      const vendor = await venderModel.find({"basicInfo.mobile" : mobile})

       vendorId = vendor[0]?._id
    
       vendorInfo = vendor[0]?.basicInfo 
       referral = vendor[0]?.basicInfo?.referral
}

      const applicationID = `RUPL${generateLoanId()}`
      const loan = await new loanModel({
     role,
        vendorId,
        applicationID,
        vendorInfo,
        type : 'personal loan',
        details
      }).save();
  
      const recipients = [
        { email:"corhaven.india@gmail.com"},
      ];
      
      
      let subAdminName ;

      if(req.vendor.role != "telecaller"){
         subAdminName  = "direct lead"
        if(referral && referral.length > 4){
          const subAdm = await subAdmModel.find({referral})
          subAdminName = subAdm[0]?.username;
      subAdm.forEach(subAdm => {
      if (subAdm.email) {
          recipients.push({ email: subAdm.email });
      }
      });
      }
      }

      const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'personal loan')
      const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'personal loan')
      
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

  const homeJob = async(req,res)=>{
    try{
      console.log(req.vendor)
const { personalDetail, propertyDetail,professionalDetail ,runningLoan} = req.body
const applicationID = `RUPL${generateLoanId()}`
const {mobile} = req.params

//   console.log(vendorId)
let vendorId ,vendorInfo, referral;
let role;
if(req.vendor.role == "telecaller"){
   role="telecaller";
   const telecaller = await wfhmodel.find({mobile})
    
           vendorId = telecaller[0]?._id
        
           vendorInfo = { username : telecaller[0].name,
            email :telecaller[0].email,
            mobile : telecaller[0].mobile,
            state: telecaller[0].state,
            city:telecaller[0].city,
            referral:telecaller[0].referral,
            qualification : " ",
            address :telecaller[0].address,
        }
}else{
  const vendor = await venderModel.find({"basicInfo.mobile" : mobile})
 vendorId = vendor[0]?._id
   vendorInfo = vendor[0]?.basicInfo 
   referral = vendor[0]?.basicInfo?.referral
}
if (!personalDetail || !propertyDetail || !professionalDetail || !runningLoan) {
  return res.status(400).json({
    error: 'personalDetail ,propertyDetail, professionalDetail, and runningLoan are required'
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
  

// const admin = await adminModel.find({});
// console.log("admin",admin)\
const recipients = [
  { email:"corhaven.india@gmail.com"},
];
// const referral = req.vendor?.basicInfo?.referral
let subAdminName ;

if(req.vendor.role != "telecaller"){
   subAdminName  = "direct lead"
  if(referral && referral.length > 4){
    const subAdm = await subAdmModel.find({referral})
    subAdminName = subAdm[0]?.username;
subAdm.forEach(subAdm => {
if (subAdm.email) {
    recipients.push({ email: subAdm.email });
}
});
}
}
// let  role="telecaller";
const loan = await new loanModel({
  role,
  vendorId,
  vendorInfo,
  applicationID,
  type : 'home loan',
  details
}).save();


const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'home loan')
const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'home loan')

await sendEmail(leadSubject,html,text,recipients)

// notifyAdmin(admin[0]._id, 'loan subbmission',"home loan submit");
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

const homeBusiness  = async(req,res)=>{
  try{
    const { personalDetail, propertyDetail,professionalDetail ,runningLoan} = req.body
    
    if (!personalDetail || !propertyDetail || !professionalDetail || !runningLoan) {
      return res.status(400).json({
        error: 'personalDetail ,propertyDetail, professionalDetail, and runningLoan are required'
      });
    }
    const {mobile} = req.params
    let vendorId ,vendorInfo, referral,role;
    if(req.vendor.role == "telecaller"){
       role="telecaller";
       const telecaller = await wfhmodel.find({mobile})
        
               vendorId = telecaller[0]?._id
            
               vendorInfo = { username : telecaller[0].name,
               email :telecaller[0].email,
               mobile : telecaller[0].mobile,
               state: telecaller[0].state,
               city:telecaller[0].city,
               referral:telecaller[0].referral,
               qualification : " ",
                address :telecaller[0].address,
            }
    }else{
      const vendor = await venderModel.find({"basicInfo.mobile" : mobile})
     vendorId = vendor[0]?._id
       vendorInfo = vendor[0]?.basicInfo 
       referral = vendor[0]?.basicInfo?.referral
    }
    const recipients = [
      { email:"corhaven.india@gmail.com"},
    ];   
    const files = req.files;
    // const vendorId = req.vendor?._id
    // const vendorInfo = req.vendor?.basicInfo
    const userDocs = { 
      panCard : files.panCard[0].location || " " ,
      aadharfront : files.aadharfront[0].location || " " ,
      aadharback : files.aadharback[0].location || " " ,
      gstMsmeCerificate : files.gstMsmeCerificate[0].location || " " ,

      itrComution1 : files.itrComution1[0].location || " " ,
      itrComution2 : files.itrComution2[0].location || " " ,
      itrComution3 : files.itrComution3[0].location || " " ,
      oneBankStatementCurrentAccount : files.oneBankStatementCurrentAccount[0].location || " " ,
      oneYearSavingAccountStatement : files.oneYearSavingAccountStatement[0].location || " ",
      propertyChain : files.propertyChain[0].location || " ",
      map : files.map[0].location || " ",
    }
        const details = {
          personalDetail: JSON.parse(personalDetail),  
          propertyDetail: JSON.parse(propertyDetail),
          professionalDetail: JSON.parse(professionalDetail),
          runningLoan: JSON.parse(runningLoan),
          document: userDocs
        }   
    let subAdminName ;
    
    if(req.vendor.role != "telecaller"){
       subAdminName  = "direct lead"
      if(referral && referral.length > 4){
        const subAdm = await subAdmModel.find({referral})
        subAdminName = subAdm[0]?.username;
    subAdm.forEach(subAdm => {
    if (subAdm.email) {
        recipients.push({ email: subAdm.email });
    }
    });
    }
    }
 
        const applicationID = `RUPL${generateLoanId()}`
        const loan = await new loanModel({
          role,
          vendorId,
          vendorInfo,
          applicationID,
      type : 'home loan',
      details
    }).save();
  
  
    const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'home loan')
    const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'home loan')
    
    await sendEmail(leadSubject,html,text,recipients)
// console.log("admin",admin)
// notifyAdmin(admin[0]._id, 'loan subbmission',"home loan submit");
    res.status(201).json({
      success : true,
        message: 'Home loan details added successfully',
        loan
      });
    } catch (error) {
      res.status(500).json({success : false, error: error.message });
    }
}
const homebtJobController = async(req,res)=>{
    try{
const {personalDetail,professionalDetail,propertyDetail ,runningLoan} = req.body

if (!personalDetail || !professionalDetail || !propertyDetail || !runningLoan) {
  return res.status(400).json({
    error: 'personalDetail, professionalDetail,propertyDetail , and runningLoan are required'
  });
}
const {mobile} = req.params
let vendorId ,vendorInfo, referral,role;
if(req.vendor.role == "telecaller"){
   role="telecaller";
   const telecaller = await wfhmodel.find({mobile})
    
           vendorId = telecaller[0]?._id
        
           vendorInfo = { username : telecaller[0].name,
            email :telecaller[0].email,
            mobile : telecaller[0].mobile,
            state: telecaller[0].state,
            city:telecaller[0].city,
            referral:telecaller[0].referral,
            qualification : " ",
            address :telecaller[0].address,
        }
}else{
  const vendor = await venderModel.find({"basicInfo.mobile" : mobile})
 vendorId = vendor[0]?._id
   vendorInfo = vendor[0]?.basicInfo 
   referral = vendor[0]?.basicInfo?.referral
}
         

let subAdminName ;
const recipients = [
  { email:"corhaven.india@gmail.com"},
];

if(req.vendor.role != "telecaller"){
   subAdminName  = "direct lead"
  if(referral && referral.length > 4){
    const subAdm = await subAdmModel.find({referral})
    subAdminName = subAdm[0]?.username;
subAdm.forEach(subAdm => {
if (subAdm.email) {
    recipients.push({ email: subAdm.email });
}
});
}
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
      propertyChain : files.propertyChain[0].location || " ",
      map :files.map[0].location || " ",
      sanctionLetter :files.sanctionLetter[0].location || " "
    }

    const details = {
      personalDetail :JSON.parse(personalDetail),
      propertyDetail: JSON.parse(propertyDetail)
      ,professionalDetail: JSON.parse(professionalDetail),
      runningLoan: JSON.parse(runningLoan),
      document: userDocs}
    
      const applicationID = `RUPL${generateLoanId()}`
      
      const loan = await new loanModel({
        role,
        vendorId,
        vendorInfo,
        applicationID,
  type : 'home loan balance transfer',
  details
}).save();


const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'home loan balance transfer')
const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'home loan balance transfer')


    await sendEmail(leadSubject,html,text,recipients)

    // notifyAdmin(admin[0]._id, 'loan subbmission',"Home loan balance transfer submit");
res.status(201).json({
  success : true,
    message: 'Home loan balance transfer details added successfully',
    loan
  });
} catch (error) {
  res.status(500).json({ error: error.message });
}
}


const homebtBusinessController = async(req,res)=>{
  try{
const {personalDetail,professionalDetail,propertyDetail ,runningLoan} = req.body

if (!personalDetail || !professionalDetail || !propertyDetail || !runningLoan) {
return res.status(400).json({
  error: 'personalDetail, professionalDetail,propertyDetail , and runningLoan are required'
});
}
const {mobile} = req.params


const files = req.files;
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
    sanctionLetter :files.sanctionLetter[0].location || " "
  }

  const details = {
    personalDetail :JSON.parse(personalDetail),
    propertyDetail: JSON.parse(propertyDetail)
    ,professionalDetail: JSON.parse(professionalDetail),
    runningLoan: JSON.parse(runningLoan),
    document: userDocs}
    let vendorId ,vendorInfo, referral,role;
    if(req.vendor.role == "telecaller"){
       role="telecaller";
       const telecaller = await wfhmodel.find({mobile})
        
               vendorId = telecaller[0]?._id
            
               vendorInfo = { username : telecaller[0].name,
                email :telecaller[0].email,
                mobile : telecaller[0].mobile,
                state: telecaller[0].state,
                city:telecaller[0].city,
                referral:telecaller[0].referral,
                qualification : " ",
                address :telecaller[0].address,
            }
    }else{
      const vendor = await venderModel.find({"basicInfo.mobile" : mobile})
     vendorId = vendor[0]?._id
       vendorInfo = vendor[0]?.basicInfo 
       referral = vendor[0]?.basicInfo?.referral
    }
             
    
    let subAdminName ;
    const recipients = [
      { email:"corhaven.india@gmail.com"},
    ];

    if(req.vendor.role != "telecaller"){
       subAdminName  = "direct lead"
      if(referral && referral.length > 4){
        const subAdm = await subAdmModel.find({referral})
        subAdminName = subAdm[0]?.username;
    subAdm.forEach(subAdm => {
    if (subAdm.email) {
        recipients.push({ email: subAdm.email });
    }
    });
    }
    }
    
    
  
          const applicationID = `RUPL${generateLoanId()}`
          
          const loan = await new loanModel({
            role,
            vendorId,
            vendorInfo,
            applicationID,
      type : 'home loan balance transfer',
      details
    }).save();
   
const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'home loan balance transfer')
const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'home loan balance transfer')


await sendEmail(leadSubject,html,text,recipients)

res.status(201).json({
success : true,
  message: 'Home loan balance transfer details added successfully',
  loan
});
} catch (error) {
res.status(500).json({ error: error.message });
}
}

const businessController = async(req,res)=>{
    try {
      const { personalDetail, professionalDetail, runningLoan} = req.body;
      const {mobile} = req.params
    
      
   
  if (!personalDetail || !professionalDetail || !runningLoan) {
    return res.status(400).json({
      error: ' professionalDetail,propertyDetail , and runningLoan are required'
    });
  }

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
     
      }
  
      const details = {
        personalDetail: JSON.parse(personalDetail),
        professionalDetail: JSON.parse(professionalDetail),
        runningLoan: JSON.parse(runningLoan),
        document: userDocs
      }
   
      let vendorId ,vendorInfo, referral,role;
      if(req.vendor.role == "telecaller"){
         role="telecaller";
         const telecaller = await wfhmodel.find({mobile})
                 vendorId = telecaller[0]?._id
                 vendorInfo = { username : telecaller[0].name,
                  email :telecaller[0].email,
                  mobile : telecaller[0].mobile,
                  state: telecaller[0].state,
                  city:telecaller[0].city,
                  referral:telecaller[0].referral,
                  qualification : " ",
                  address :telecaller[0].address,
              }
      }else{
        const vendor = await venderModel.find({"basicInfo.mobile" : mobile})
       vendorId = vendor[0]?._id
         vendorInfo = vendor[0]?.basicInfo 
         referral = vendor[0]?.basicInfo?.referral
      }
               
      const recipients = [
        { email:"corhaven.india@gmail.com"},
      ]; 
      let subAdminName ;
      
      if(req.vendor.role != "telecaller"){
         subAdminName  = "direct lead"
        if(referral && referral.length > 4){
          const subAdm = await subAdmModel.find({referral})
          subAdminName = subAdm[0]?.username;
      subAdm.forEach(subAdm => {
      if (subAdm.email) {
          recipients.push({ email: subAdm.email });
      }
      });
      }
      }
      
      
   
  
            const applicationID = `RUPL${generateLoanId()}`
            
      const loan = await new loanModel({
        role,
        vendorId,
        vendorInfo,
        applicationID,
        type : 'business loan',
        details
      }).save();
     
  const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'business loan')
  const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'business loan')
  
  
  
  
  await sendEmail(leadSubject,html,text,recipients)
  
    //   notifyAdmin(vendorId, 'loan subbmission',"business loan submit");
      res.status(201).json({
        success : true,
        message: 'business loan details added successfully',
        loan
      });
    } catch (error) {
      res.status(500).json({success : false, error: error.message });
    }
  
  }

//
  const lapJobController = async(req,res)=>{
    try{
const {personalDetail,propertyDetail,professionalDetail ,runningLoan} = req.body

if (!personalDetail || !propertyDetail || !professionalDetail || !runningLoan) {
  return res.status(400).json({
    error: 'personalDetail,propertyDetail, professionalDetail, and runningLoan are required'
  });
}
    const {mobile} = req.params
   
      
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
  
    const recipients = [
      { email:"corhaven.india@gmail.com"},
    ];
    let vendorId ,vendorInfo, referral,role;
      if(req.vendor.role == "telecaller"){
         role="telecaller";
         const telecaller = await wfhmodel.find({mobile})
          
                 vendorId = telecaller[0]?._id
              
                 vendorInfo = { username : telecaller[0].name,
                  email :telecaller[0].email,
                  mobile : telecaller[0].mobile,
                  state: telecaller[0].state,
                  city:telecaller[0].city,
                  referral:telecaller[0].referral,
                  qualification : " ",
                  address :telecaller[0].address,
              }
      }else{
        const vendor = await venderModel.find({"basicInfo.mobile" : mobile})
       vendorId = vendor[0]?._id
         vendorInfo = vendor[0]?.basicInfo 
         referral = vendor[0]?.basicInfo?.referral
      }
               
      
      let subAdminName ;
      
      if(req.vendor.role != "telecaller"){
         subAdminName  = "direct lead"
        if(referral && referral.length > 4){
          const subAdm = await subAdmModel.find({referral})
          subAdminName = subAdm[0]?.username;
      subAdm.forEach(subAdm => {
      if (subAdm.email) {
          recipients.push({ email: subAdm.email });
      }
      });
      }
      }
      

  
      const applicationID = `RUPL${generateLoanId()}`
      const loan = await new loanModel({
        role,
        vendorId,
        vendorInfo,
        applicationID,
  type : 'loan against property',
  details
}).save();
     
  const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'loan against property')
  const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'loan against property')
  
    
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

const lapBusinessController = async(req,res)=>{
  try{
    const { personalDetail, propertyDetail,professionalDetail ,runningLoan} = req.body
    
    if (!personalDetail || !propertyDetail || !professionalDetail || !runningLoan) {
      return res.status(400).json({
        error: 'personalDetail ,propertyDetail, professionalDetail, and runningLoan are required'
      });
    }
    const files = req.files;
    const {mobile} = req.params
   
 
    
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
     
    const recipients = [
      { email:"corhaven.india@gmail.com"},
    ];
    
    let vendorId ,vendorInfo, referral,role;
      if(req.vendor.role == "telecaller"){
         role="telecaller";
         const telecaller = await wfhmodel.find({mobile})
          
                 vendorId = telecaller[0]?._id
              
                 vendorInfo = { username : telecaller[0].name,
                  email :telecaller[0].email,
                  mobile : telecaller[0].mobile,
                  state: telecaller[0].state,
                  city:telecaller[0].city,
                  referral:telecaller[0].referral,
                  qualification : " ",
                  address :telecaller[0].address,
              }
      }else{
        const vendor = await venderModel.find({"basicInfo.mobile" : mobile})
       vendorId = vendor[0]?._id
         vendorInfo = vendor[0]?.basicInfo 
         referral = vendor[0]?.basicInfo?.referral
      }
               
      
      let subAdminName ;
      
      if(req.vendor.role != "telecaller"){
         subAdminName  = "direct lead"
        if(referral && referral.length > 4){
          const subAdm = await subAdmModel.find({referral})
          subAdminName = subAdm[0]?.username;
      subAdm.forEach(subAdm => {
      if (subAdm.email) {
          recipients.push({ email: subAdm.email });
      }
      });
      }
      }
      
    
  
      const applicationID = `RUPL${generateLoanId()}`
      const loan = await new loanModel({
        vendorId,
        vendorInfo,
        applicationID,
  type : 'loan against property',
  details
}).save();
     
  const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'loan against property')
  const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'loan against property')
  
    
    
    
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
const lapbtJob = async(req,res)=>{
    try{
const {personalDetail,propertyDetail,professionalDetail ,runningLoan} = req.body

if (!personalDetail || !propertyDetail || !professionalDetail || !runningLoan) {
  return res.status(400).json({
    error: 'personalDetail,propertyDetail, professionalDetail, and runningLoan are required'
  });
}
const {mobile} = req.params

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
      sanctionLetter :files.sanctionLetter[0].location || " "

    }
    const details = {
      personalDetail: JSON.parse(personalDetail),

      propertyDetail: JSON.parse(propertyDetail)
      ,professionalDetail: JSON.parse(professionalDetail),
      runningLoan: JSON.parse(runningLoan),
      document: userDocs}
   
const recipients = [
  { email:"corhaven.india@gmail.com"},
];
let vendorId ,vendorInfo, referral,role;
if(req.vendor.role == "telecaller"){
   role="telecaller";
   const telecaller = await wfhmodel.find({mobile})
    
           vendorId = telecaller[0]?._id
        
           vendorInfo = { username : telecaller[0].name,
            email :telecaller[0].email,
            mobile : telecaller[0].mobile,
            state: telecaller[0].state,
            city:telecaller[0].city,
            referral:telecaller[0].referral,
            qualification : " ",
            address :telecaller[0].address,
        }
}else{
  const vendor = await venderModel.find({"basicInfo.mobile" : mobile})
 vendorId = vendor[0]?._id
   vendorInfo = vendor[0]?.basicInfo 
   referral = vendor[0]?.basicInfo?.referral
}
         

let subAdminName ;

if(req.vendor.role != "telecaller"){
   subAdminName  = "direct lead"
  if(referral && referral.length > 4){
    const subAdm = await subAdmModel.find({referral})
    subAdminName = subAdm[0]?.username;
subAdm.forEach(subAdm => {
if (subAdm.email) {
    recipients.push({ email: subAdm.email });
}
});
}
}

const applicationID = `RUPL${generateLoanId()}`
const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'loan against property bt')
const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'loan against property bt')
const loan = await new loanModel({
  role,
  vendorId,
  vendorInfo,
  applicationID,
type : 'loan against property bt',
details
}).save();
await sendEmail(leadSubject,html,text,recipients)

res.status(200).json({
  success : true,
    message: 'loan Against Property bt details added successfully',
    loan
  });
} catch (error) {
  res.status(500).json({ error: error.message });
}
}

const lapbtBusinessController = async(req,res)=>{
  try{
    const { personalDetail, propertyDetail,professionalDetail ,runningLoan} = req.body
    
    if (!personalDetail || !propertyDetail || !professionalDetail || !runningLoan) {
      return res.status(400).json({
        error: 'personalDetail ,propertyDetail, professionalDetail, and runningLoan are required'
      });
    }
    const files = req.files;
    const {mobile} = req.params
   
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
      sanctionLetter :files.sanctionLetter[0].location || " "

    }
    

        const details = {
          personalDetail: JSON.parse(personalDetail),  
          propertyDetail: JSON.parse(propertyDetail),
          professionalDetail: JSON.parse(professionalDetail),
          runningLoan: JSON.parse(runningLoan),
          document: userDocs
        }   
      
    const recipients = [
      { email:"corhaven.india@gmail.com"},
    ];
    // const referral = req.vendor?.basicInfo?.referral
    
    let vendorId ,vendorInfo, referral,role;
    if(req.vendor.role == "telecaller"){
       role="telecaller";
       const telecaller = await wfhmodel.find({mobile})
        
               vendorId = telecaller[0]?._id
            
               vendorInfo = { username : telecaller[0].name,
                email :telecaller[0].email,
                mobile : telecaller[0].mobile,
                state: telecaller[0].state,
                city:telecaller[0].city,
                referral:telecaller[0].referral,
                qualification : " ",
                address :telecaller[0].address,
            }
    }else{
      const vendor = await venderModel.find({"basicInfo.mobile" : mobile})
     vendorId = vendor[0]?._id
       vendorInfo = vendor[0]?.basicInfo 
       referral = vendor[0]?.basicInfo?.referral
    }
             
    
    let subAdminName ;
    
    if(req.vendor.role != "telecaller"){
       subAdminName  = "direct lead"
      if(referral && referral.length > 4){
        const subAdm = await subAdmModel.find({referral})
        subAdminName = subAdm[0]?.username;
    subAdm.forEach(subAdm => {
    if (subAdm.email) {
        recipients.push({ email: subAdm.email });
    }
    });
    }
    }
    
    const applicationID = `RUPL${generateLoanId()}`
    const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'loan against property bt')
    const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'loan against property bt')

    const loan = await new loanModel({
      vendorId,
      applicationID,
  vendorInfo,
  type : 'loan against property bt',
  details
}).save();
    await sendEmail(leadSubject,html,text,recipients)
    res.status(201).json({
      success : true,
        message: 'loan against property bt details added successfully',
        loan
      });
    } catch (error) {
      res.status(500).json({success : false, error: error.message });
    }
}
const usedCarJob = async(req,res)=>{
    try{
const { personalDetail, carDetail,professionalDetail ,runningLoan} = req.body

if (!personalDetail || !carDetail || !professionalDetail || !runningLoan) {
  return res.status(400).json({
    error: 'personalDetail ,carDetail, professionalDetail, and runningLoan are required'
  });
}

const files = req.files;
const {mobile} = req.params


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
// sanctionLetter :files.sanctionLetter[0].location || " "
}

    const details = {
      personalDetail: JSON.parse(personalDetail),

      carDetail: JSON.parse(carDetail),
      professionalDetail: JSON.parse(professionalDetail),
      runningLoan: JSON.parse(runningLoan),
      document: userDocs
    }
   
// const admin = await adminModel.find({});
// // console.log("admin",admin)

// notifyAdmin(admin[0]._id, 'loan subbmission',"home loan submit");
const recipients = [
  { email:"corhaven.india@gmail.com"},
];

let vendorId ,vendorInfo, referral,role;
if(req.vendor.role == "telecaller"){
   role="telecaller";
   const telecaller = await wfhmodel.find({mobile})
    
           vendorId = telecaller[0]?._id
        
           vendorInfo = { username : telecaller[0].name,
            email :telecaller[0].email,
            mobile : telecaller[0].mobile,
            state: telecaller[0].state,
            city:telecaller[0].city,
            referral:telecaller[0].referral,
            qualification : " ",
            address :telecaller[0].address,
        }
}else{
  const vendor = await venderModel.find({"basicInfo.mobile" : mobile})
 vendorId = vendor[0]?._id
   vendorInfo = vendor[0]?.basicInfo 
   referral = vendor[0]?.basicInfo?.referral
}
         

let subAdminName ;

if(req.vendor.role != "telecaller"){
   subAdminName  = "direct lead"
  if(referral && referral.length > 4){
    const subAdm = await subAdmModel.find({referral})
    subAdminName = subAdm[0]?.username;
subAdm.forEach(subAdm => {
if (subAdm.email) {
    recipients.push({ email: subAdm.email });
}
});
}
}
const applicationID = `RUPL${generateLoanId()}`

const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'used car loan')
const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'used car loan')
    
const loan = await new loanModel({
  role,
  vendorId,
  applicationID,
vendorInfo,
type : 'used car loan',
details
}).save();


await sendEmail(leadSubject,html,text,recipients)

res.status(201).json({
  success : true,
    message: 'Used Car loan details added successfully',
    loan
  });
} catch (error) {
  console.log(error)
  res.status(500).json({success : false, error: error.message });
}
}

const usedCarBusiness= async(req,res)=>{
  try{
    const { personalDetail, carDetail,professionalDetail ,runningLoan} = req.body
    
    if (!personalDetail || !carDetail || !professionalDetail || !runningLoan) {
      return res.status(400).json({
        error: 'personalDetail ,carDetail, professionalDetail, and runningLoan are required'
      });
    }

    const files = req.files;
    const {mobile} = req.params

    
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
    //   sanctionLetter :files.sanctionLetter[0].location || " "

    }
        const details = {
          personalDetail: JSON.parse(personalDetail),  
          carDetail: JSON.parse(carDetail),
          professionalDetail: JSON.parse(professionalDetail),
          runningLoan: JSON.parse(runningLoan),
          document: userDocs
        }   

const recipients = [
  { email:"corhaven.india@gmail.com"},
];

let vendorId ,vendorInfo, referral,role;
if(req.vendor.role == "telecaller"){
   role="telecaller";
   const telecaller = await wfhmodel.find({mobile})
    
           vendorId = telecaller[0]?._id
        
           vendorInfo = { username : telecaller[0].name,
            email :telecaller[0].email,
            mobile : telecaller[0].mobile,
            state: telecaller[0].state,
            city:telecaller[0].city,
            referral:telecaller[0].referral,
            qualification : " ",
            address :telecaller[0].address,
        }
}else{
  const vendor = await venderModel.find({"basicInfo.mobile" : mobile})
 vendorId = vendor[0]?._id
   vendorInfo = vendor[0]?.basicInfo 
   referral = vendor[0]?.basicInfo?.referral
}
let subAdminName ;
if(req.vendor.role != "telecaller"){
   subAdminName  = "direct lead"
  if(referral && referral.length > 4){
    const subAdm = await subAdmModel.find({referral})
    subAdminName = subAdm[0]?.username;
subAdm.forEach(subAdm => {
if (subAdm.email) {
    recipients.push({ email: subAdm.email });
}
});
}
}
const applicationID = `RUPL${generateLoanId()}`

const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'used car loan')
const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'used car loan')
const loan = await new loanModel({
  vendorId,
  applicationID,
vendorInfo,
type : 'used car loan',
details
}).save();
await sendEmail(leadSubject,html,text,recipients)
    res.status(201).json({
      success : true,
        message: 'Used Car loan details added successfully',
        loan
      });
    } catch (error) {
      res.status(500).json({success : false, error: error.message });
    }
}
const usedCarbtJobController = async(req,res)=>{
    try{
const { personalDetail, carDetail,professionalDetail ,runningLoan} = req.body

if (!personalDetail || !carDetail || !professionalDetail || !runningLoan) {
  return res.status(400).json({
    error: 'personalDetail ,carDetail, professionalDetail,runningCarLoan and runningLoan are required'
  });
}
const files = req.files;


const {mobile} = req.params

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
 
const recipients = [
  { email:"corhaven.india@gmail.com"},
];
// const referral = req.vendor?.basicInfo?.referral

let vendorId ,vendorInfo, referral,role;
if(req.vendor.role == "telecaller"){
   role="telecaller";
   const telecaller = await wfhmodel.find({mobile})
    
           vendorId = telecaller[0]?._id
        
           vendorInfo = { username : telecaller[0].name,
            email :telecaller[0].email,
            mobile : telecaller[0].mobile,
            state: telecaller[0].state,
            city:telecaller[0].city,
            referral:telecaller[0].referral,
            qualification : " ",
            address :telecaller[0].address,
        }
}else{
  const vendor = await venderModel.find({"basicInfo.mobile" : mobile})
 vendorId = vendor[0]?._id
   vendorInfo = vendor[0]?.basicInfo 
   referral = vendor[0]?.basicInfo?.referral
}
         

let subAdminName ;

if(req.vendor.role != "telecaller"){
   subAdminName  = "direct lead"
  if(referral && referral.length > 4){
    const subAdm = await subAdmModel.find({referral})
    subAdminName = subAdm[0]?.username;
subAdm.forEach(subAdm => {
if (subAdm.email) {
    recipients.push({ email: subAdm.email });
}
});
}
}
const applicationID = `RUPL${generateLoanId()}`

const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'used car loan bt')
const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'used car loan bt')

    
const loan = await new loanModel({
  role,
  vendorId,
  vendorInfo,
  applicationID,
type : 'used car loan bt',
details
}).save();


await sendEmail(leadSubject,html,text,recipients)
res.status(201).json({
  success : true,
    message: 'used car loan bt details added successfully',
    loan
  });
} catch (error) {
  console.log(error)
  res.status(500).json({success : false, error: error.message });
}
}

const usedcarBtBusinessController = async(req,res)=>{
  try{
    const { personalDetail, carDetail,professionalDetail ,runningLoan} = req.body
    
    if (!personalDetail || !carDetail || !professionalDetail || !runningLoan ) {
      return res.status(400).json({
        error: 'personalDetail ,carDetail, professionalDetail,runningCarLoan and runningLoan are required'
      });
    }
    const files = req.files;
    const {mobile} = req.params
  
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
       
    // const admin = await adminModel.find({});
// console.log("admin",admin)
const recipients = [
  { email:"corhaven.india@gmail.com"},
];

let vendorId ,vendorInfo, referral;
if(req.vendor.role == "telecaller"){
   const telecaller = await wfhmodel.find({mobile})
    
           vendorId = telecaller[0]?._id
        
           vendorInfo = { username : telecaller[0].name,
            email :telecaller[0].email,
            mobile : telecaller[0].mobile,
            state: telecaller[0].state,
            city:telecaller[0].city,
            referral:telecaller[0].referral,
            qualification : " ",
            address :telecaller[0].address,
        }
}else{
  const vendor = await venderModel.find({"basicInfo.mobile" : mobile})
 vendorId = vendor[0]?._id
   vendorInfo = vendor[0]?.basicInfo 
   referral = vendor[0]?.basicInfo?.referral
}
         

let subAdminName ;

if(req.vendor.role != "telecaller"){
   subAdminName  = "direct lead"
  if(referral && referral.length > 4){
    const subAdm = await subAdmModel.find({referral})
    subAdminName = subAdm[0]?.username;
subAdm.forEach(subAdm => {
if (subAdm.email) {
    recipients.push({ email: subAdm.email });
}
});
}
}
const applicationID = `RUPL${generateLoanId()}`

const loan = await new loanModel({
  vendorId,
  vendorInfo,
  applicationID,
  type : 'used car loan bt',
  details
}).save();

const text =await leadTextMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'used car loan bt')
const html =await leadHtmlMessage(applicationID,details.personalDetail.username,subAdminName ? subAdminName:"telecaller",'used car loan bt')


await sendEmail(leadSubject,html,text,recipients)
    res.status(201).json({
      success : true,
        message: 'Used Car loan bt details added successfully',
        loan
      });
    } catch (error) {
      res.status(500).json({success : false, error: error.message });
    }
}
  module.exports= {usedCarbtJobController,usedcarBtBusinessController,usedCarBusiness,usedCarJob,lapbtBusinessController,lapbtJob,lapJobController,lapBusinessController,businessController,homebtJobController,personalLoanController,personalLoanbtController,homeBusiness,homeJob,homebtBusinessController}