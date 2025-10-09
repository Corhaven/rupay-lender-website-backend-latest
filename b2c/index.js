const express  = require("express")
const { loanController,getInquiries ,inquiryVerify,resendOtp, faqsInquiry} = require("./controllers/loanController")
const inquiryMiddleware = require("../middlewares/inquirymiddleware")
const {login , verifyb2cOtp } = require("./controllers/loginController")
const { getServices, updateStatus, getStatusHistory,getReferralHistory,getCustomerInquiries, getCustomerprofile } = require("./controllers/servicesController")
const { sendOtp } = require("../auth/authController")
const authMiddleware = require("../middlewares/authmiddleware")
const authorize = require("../middlewares/role")
const { getVendorsWithoutReferral, vendorUpdateStatus } = require("./controllers/vendorController")
const otpMiddleware = require("../middlewares/otpmiddleware")
const Earning = require("./model/earningModel")
const { default: mongoose } = require("mongoose")
// const shopModel = require("./model/shopModel")

const b2cRouter = express.Router()
b2cRouter.post("/login",login)
b2cRouter.post("/send-otp",sendOtp)
b2cRouter.post("/verify-otp",otpMiddleware,verifyb2cOtp)



b2cRouter.get("/b2b-vendors",authMiddleware,authorize(['salesMan']),getVendorsWithoutReferral)
b2cRouter.put("/update-vendor-status/:vendorId",vendorUpdateStatus)
b2cRouter.get("/customer/get-profile",authMiddleware,getCustomerprofile)
b2cRouter.post("/inquiry-submission",loanController)
b2cRouter.post("/inquiry-verify",inquiryMiddleware,inquiryVerify)
b2cRouter.post("/resend-otp",inquiryMiddleware,resendOtp) 
b2cRouter.get("/get-inquiries",authMiddleware,getInquiries) 
b2cRouter.get("/services/:type",authMiddleware,getServices)
b2cRouter.put("/update-status/:inquiryId",authMiddleware,updateStatus)
b2cRouter.get("/get-status-history/:mobile",getStatusHistory)
b2cRouter.get("/get-customer-inquiries/:mobile",getCustomerInquiries)
b2cRouter.post("/faqs-inquiry",faqsInquiry) 

b2cRouter.get("/get-referral-history/:referral",getReferralHistory)
b2cRouter.get("/get",getReferralHistory)

// const mongoose = require('mongoose');
// const Loan = require('./models/Loan'); // Path to your Loan model

const loanData = {
  "Personal Loan": {
    earningAmount: 200,
  },
  "Home Loan": {
    earningAmount: 200,
  },
  "Business Loan": {
    earningAmount: 200,
  },
  "Personal Loan Balance Transfer": {
    earningAmount: 200,
  },
  "Home Loan Balance Transfer": {
    earningAmount: 200,
  },
  "Loan Against Property Balance Transfer": {
    earningAmount: 200,
  },
  "Car Insurance": {
    earningAmount: 200,
  },
  "Web Development": {
    earningAmount: 200,
  },
  "Professional Loan": {
    earningAmount: 200,
  },
  "Credit card": {
    earningAmount: 200,
  },
  "Social media management": {
    earningAmount: 200,
  },
  "Loan against property": {
    earningAmount: 200,
  },
};

const seedLoanData = async () => {
  try {

    await Earning.deleteMany({});

    const loanArray = Object.entries(loanData).map(([type, { earningAmount }]) => ({
      type,
      earning: earningAmount,
    }));

    await Earning.insertMany(loanArray);
    // console.log('Loan data inserted successfully!');

    // Close connection
    // await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};
b2cRouter.get("/get-referral-card",
  async(req,res)=>{
    try {
    referralEarning = await Earning.find({})
    res.status(200).send({success : true ,referralEarning})

  } catch (error) {
    console.log(error.mesage)
    res.status(500).send({success : false,message : "Not found referal earning"})

  }
}
)


module.exports =  {b2cRouter}