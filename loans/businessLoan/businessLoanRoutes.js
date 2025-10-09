const express = require("express");
const {validator} = require("../../middlewares/validators");
const {submitController,businessLoanController} = require("./businessLoanController");
// const upload = require("../../helpers/multer");
const authMiddleware = require("../../middlewares/authmiddleware");
const { businessimgObject } = require("../../helpers/imageObject");
const businessLoanRouter = express.Router();


businessLoanRouter.post("/submit",businessimgObject,authMiddleware, submitController)
businessLoanRouter.get("/getall-business-loans",authMiddleware,businessLoanController)


module.exports = businessLoanRouter;