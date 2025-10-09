const express = require("express");
const {submitController,getAllpersonalloanBalancetransfer} = require("./personalLoanBalanceTransferController");
// const upload = require("../../helpers/multer");
const authMiddleware = require("../../middlewares/authmiddleware");
const { imgObject } = require("../../helpers/imageObject");
const personalLoanBalanceTransferRouter = express.Router();

personalLoanBalanceTransferRouter.post("/submit",imgObject,authMiddleware,submitController)
// personalLoanBalanceTransferRouter.post("/submit",imgObject,authMiddleware,submitController)

personalLoanBalanceTransferRouter.get("/get-all-personal-loan-balance-transfer",authMiddleware,getAllpersonalloanBalancetransfer)


module.exports = personalLoanBalanceTransferRouter;