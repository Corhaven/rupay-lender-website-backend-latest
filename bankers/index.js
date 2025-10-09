const express  = require("express");
const { bankerObject } = require("../helpers/imageObject");
// const bankerModel = require("./bankerModel");

const otpMiddleware = require("../middlewares/otpmiddleware");
// const jwt = require("jsonwebtoken");
const { verifyAdharOtpBanker, aadharOtp } = require("../auth/authController");
const { getBankerProfile, verifyOtp, sendOtp, createbanker } = require("./bankerController");
const { getBankers } = require("../admin/login");
const authMiddleware = require("../middlewares/authmiddleware");
const authorize = require("../middlewares/role");
// const adminRouter = require("../admin");

const bankerRouter = express.Router()

bankerRouter.post("/add-banker",bankerObject,createbanker); 
// bankerRouter.put('/update-info/:id',);
bankerRouter.post("/send-otp",sendOtp)
bankerRouter.post("/verify-otp",otpMiddleware,verifyOtp)
bankerRouter.post("/aadhar-otp",aadharOtp)
// const addBanker = async()=>{
//     const {name, bank , officialEmail, mobile , pinCode} = req.body
// }
// bankerRouter.post("/add-banker",addBanker)
bankerRouter.post("/aadhar-verify",verifyAdharOtpBanker)
bankerRouter.get("/banker-profile/:id",getBankerProfile)
bankerRouter.get("/get-bankers",authMiddleware,authorize(["admin"]),getBankers)
    module.exports = {bankerRouter}