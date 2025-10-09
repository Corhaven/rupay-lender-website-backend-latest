const express = require("express");
const { createSubVendor, verifyOtp } = require("./Controllers");
const authMiddleware = require("../middlewares/authmiddleware");
const { sendOtp } = require("../carrier/controllers/wfhController");
const otpMiddleware = require("../middlewares/otpmiddleware");
// const { getProfileController } = require("../vendor/vendorController");

const subVendorRouter = express.Router();

subVendorRouter.post("/create-subVendor",authMiddleware,createSubVendor)
subVendorRouter.post("/send-otp",sendOtp)
subVendorRouter.post("/verify-otp",otpMiddleware,verifyOtp)
// subVendorRouter.post("/get-profile",authMiddleware,getProfileController)

module.exports = {subVendorRouter};