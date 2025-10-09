const express = require("express")
const {signUp,loginController, forgotPasswordController, updateController, 
 getProfileController,
 getAllvendorLoan,
 getId,
 uploadDocs,
 resendOtp,
 vPaymentHistoryController,
 getNotification,
 pendencyDocs,
 uploadIncVoice,
 uploadIncVoiceLoan,
 updateWallet,
 createShop,
 getShop,
 verifyOtpController,
 getConnectors,
 getPic,
 getWalletHistory,
 walletTopup,getBlogDetails,paidUpdateController,
 getEvents,subsCribe,
 getSubscriber,
 referralUpdate} = require("./vendorController");
const {validator} = require("../middlewares/validators");
const { signupSchema, loginSchema} = require("./vendorSchema");
const authMiddleware = require("../middlewares/authmiddleware");
const jwt = require("jsonwebtoken");
const { getsingleLoan, getStatusHistory } = require("../admin/getloans");
// const upload = require("../helpers/multer");
const { getIo } = require("../helpers/socket");
const notificationModel = require("../models/notificationModel");
const { getBlog } = require("../admin/blog");
const pinCode = require("../helpers/pinCode");
const signUpMiddleware = require("../middlewares/signUpmiddleware");
const { initiateCashfreePayment } = require("../helpers/cashfree");
const otpMiddleware = require("../middlewares/otpmiddleware");
const  upload  = require("../helpers/multer");
const {upload2, uploadB2bLeads} = require("../helpers/multervendor");

const imgObject = upload2.fields([
  { name: 'panCard', maxCount: 1 },
  { name: 'aadharfront', maxCount: 1 },
  { name: 'gstMsmeCerificate', maxCount: 1 },
  { name: 'pic', maxCount: 1 },
  ])
const pendencyObject = uploadB2bLeads.fields([
  { name: 'panCard', maxCount: 1 },
  { name: 'aadharfront', maxCount: 1 },
  { name: 'aadharback', maxCount: 1 },
  { name: 'payslip1', maxCount: 1 },
  { name: 'payslip2', maxCount: 1 },
  { name: 'payslip3', maxCount: 1 },
  { name: 'form26', maxCount: 1 },
  { name: 'form16', maxCount: 1 },
  { name: 'sevenMonthStatement', maxCount: 1 },
  { name: 'closerLetter1', maxCount: 1 },
{ name: 'closerLetter2', maxCount: 1 },
{ name: 'closerLetter3', maxCount: 1 },
{ name: 'propertyChain', maxCount: 1 },
{ name: 'map', maxCount: 1 }
,{ name: 'gstMsmeCerificate', maxCount: 1 },
{ name: 'itrComution1', maxCount: 1 },
{ name: 'itrComution2', maxCount: 1 },
{ name: 'itrComution3', maxCount: 1 },
{ name: 'oneBankStatementCurrentAccount', maxCount: 1 },
{ name: 'oneYearSavingAccountStatement', maxCount: 1 },
{ name: 'sanctionLetter', maxCount: 1 },
{ name: 'insurancePolicy', maxCount: 1 },
{ name: 'rc', maxCount: 1 }
])
const venderRouter = express.Router()
venderRouter.post("/register",signUp) 
venderRouter.post("/login",validator(loginSchema),loginController) 
venderRouter.put("/paid-plan",paidUpdateController)
venderRouter.post("/verify-otp",otpMiddleware,verifyOtpController) 
venderRouter.post("/update-profile",imgObject,authMiddleware,updateController) 
venderRouter.post("/update-referral",authMiddleware,referralUpdate)


venderRouter.get("/get-profile",authMiddleware,getProfileController) 
venderRouter.put("/upload-docs",imgObject,authMiddleware,uploadDocs) 
venderRouter.put("/pendency-docs/:loanId",pendencyObject,authMiddleware,pendencyDocs) 
//
venderRouter.get("/vendor-all-loans",authMiddleware,getAllvendorLoan) 
venderRouter.get("/get-single-loan/:loanId",authMiddleware,getsingleLoan)
// resendOtp
venderRouter.post("/resend-otp",signUpMiddleware,resendOtp) 
venderRouter.get("/vendor-payment-history",authMiddleware,vPaymentHistoryController) 

venderRouter.get('/get-notification',authMiddleware, getNotification)
venderRouter.get("/get-user",authMiddleware,getId)

const invoice = uploadB2bLeads.fields([{ name: 'uploadInvoice', maxCount: 1 },])
venderRouter.put("/upload-invoice/:loanId",invoice,authMiddleware,uploadIncVoiceLoan)
venderRouter.get("/get-status-history/:loanId",authMiddleware,getStatusHistory)
venderRouter.post("/update-wallet",authMiddleware,updateWallet)
venderRouter.post("/get-address",pinCode)
venderRouter.get("/blogs",getBlog)

venderRouter.get("/blogs-details/:slug",getBlogDetails)
venderRouter.post("/subscribe",subsCribe)
venderRouter.get("/get-subscriber",getSubscriber)


venderRouter.post("/create-shop",authMiddleware,createShop)
venderRouter.get("/get-shops",authMiddleware,getShop)
venderRouter.get("/get-connectors",authMiddleware,getConnectors)
venderRouter.get("/get-wallet-history",authMiddleware,getWalletHistory)
venderRouter.post("/wallet-topup",authMiddleware,walletTopup)

// venderRouter.get("/get-connectors",authMiddleware,getConnectors)

venderRouter.patch('/get-notification/read', async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
venderRouter.get("/get-pic",getPic)
venderRouter.get("/get-event",getEvents)


module.exports = venderRouter;

