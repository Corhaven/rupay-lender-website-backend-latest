const express = require("express")
const {sendOtp,verifyOtp, forgotPasswordController, changePasswordController, verifyResetOtp, resendResetOtp, aadharOtp, verifyAdharOtp, panVerify, bankVerify, gstVerify, verifyAdharOtpBanker, verifyAdharOtpShop, panVerifyShop, bankVerifyShop } = require("./authController")
const authMiddleware = require("../middlewares/authmiddleware")
// const signUpMiddleware = require("../middlewares/signUpmiddleware")
const forgotMiddleware = require("../middlewares/forgotmiddleware")
const otpMiddleware = require("../middlewares/otpmiddleware")
const authRouter = express.Router()
authRouter.post("/send-otp",sendOtp)
authRouter.post("/mobile-verify",otpMiddleware,verifyOtp)
// authRouter.post("/verify-otp",signUpMiddleware,verifyOTP) 

authRouter.post("/verify-resend-otp",forgotMiddleware,resendResetOtp) 

authRouter.post("/forgot-password",forgotPasswordController) 
authRouter.post("/verify-reset-otp",forgotMiddleware,verifyResetOtp) 

// authRouter.post("/verify-resend-otp",forgotMiddleware,resetPassword) 

 
authRouter.post("/change-password",authMiddleware,changePasswordController) 

/////vendor kyc verification apis
authRouter.post("/aadhar-otp",authMiddleware,aadharOtp)
authRouter.post("/aadhar-verify",authMiddleware,verifyAdharOtp)
authRouter.post("/pan-verify",authMiddleware,panVerify)
authRouter.post("/bank-verify",authMiddleware,bankVerify)
authRouter.post("/gst-verify",authMiddleware,gstVerify)
////// shops verification APIs
authRouter.post("/pan-verify-shop",panVerifyShop)
authRouter.post("/verify-shop-aadhar",verifyAdharOtpShop)
authRouter.post("/bank-verify-shop",bankVerifyShop)


// bankVerifyShop
module.exports = authRouter
