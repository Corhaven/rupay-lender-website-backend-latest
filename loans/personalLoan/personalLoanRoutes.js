const express = require("express");
const {validator} = require("../../middlewares/validators");
const {getAllpersonalLoan,submitController} = require("./personalLoanController");
// const upload = require("../../helpers/multer");
const authMiddleware = require("../../middlewares/authmiddleware");
const { cpLoad } = require("../../helpers/imageObject");
const personalLoanRouter = express.Router();

personalLoanRouter.post("/submit",authMiddleware,cpLoad,submitController)
personalLoanRouter.get("/get-all-personal-loans",authMiddleware,getAllpersonalLoan)
      
module.exports = personalLoanRouter;