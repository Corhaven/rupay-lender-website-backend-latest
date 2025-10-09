const express  = require("express")
const personalLoanRouter = require("./personalLoan/personalLoanRoutes")
const personalLoanBalanceTransferRouter = require("./personalLoanBalanceTransfer/personalLoanBalanceTransferRoutes")
const loanAgainstPropertyRouter = require("./loanAgainstProperty/loanAgainstPropertyRoutes")
const businessLoanRouter = require("./businessLoan/businessLoanRoutes")
const homeLoanbalanceTransferRouter = require("./homeLoanbalanceTransfer/homeLoanbalanceTransferRoutes")
const homeLoanRouter = require("./homeLoan/homeLoanRoutes")
// const usedCarLoanRouter = require("./usedCarLoan-bt/usedCarLoan_btRoutes")
const usedCarLoanbtRouter = require("./usedCarLoan-bt/usedCarLoan_btRoutes")
const usedCarLoanRouter = require("./usedCarLoan/usedCarLoanRoutes")
const lap_btRouter = require("./lap-btLoan/lap-btLoanRoutes")
// const { unPaidLoan, paidLoan } = require("../admin/payment")
const authorize = require("../middlewares/role")
const authMiddleware = require("../middlewares/authmiddleware")
const loanModel = require("../models/loanModel")

loanRouter = express.Router()

loanRouter.use("/personal-loans",personalLoanRouter)
loanRouter.use("/home-loans",homeLoanRouter)
loanRouter.use("/personal-loan-balance-transfer",personalLoanBalanceTransferRouter)
loanRouter.use("/loan-against-property",loanAgainstPropertyRouter)
loanRouter.use("/loan-against-property-bt",lap_btRouter)
loanRouter.use("/business-loan",businessLoanRouter)
loanRouter.use("/home-loan-balance-transfer",homeLoanbalanceTransferRouter)
loanRouter.use("/used-car-loan",usedCarLoanRouter)
loanRouter.use("/used-car-loan-bt",usedCarLoanbtRouter)
loanRouter.get("/get-unpaid-loan",authMiddleware,async(req,res)=>{
    try {
      const id = req.vendor._id
      const product = await loanModel.find({'status.loanStatus' : "Completed",'paymentStatus' : "unpaid",vendorId : id}).select('applicationID type status.disburstAmount status.bank utrNo uploadInvoice downLoadInvoice disbursedDate payOut paidDate vendorInfo.referral').lean()
  
      // console.log(product)
      res.status(200).send({success:true,product})
    } catch (error) {
      res.status(500).send({  
          success: false,
          message: error.message,
    })
  }
  })
   
  
loanRouter.get("/get-paid-loan",authMiddleware,authorize(['vendor']),async(req,res)=>{
    try {
      const id = req.vendor._id
      const product = await loanModel.find({'status.loanStatus' : "Completed",'paymentStatus' : "paid",vendorId : id}).select('applicationID type status.disburstAmount status.bank utrNo uploadInvoice disbursedDate downLoadInvoice payOut paidDate vendorInfo.referral').lean()
  
      // console.log(product)
      res.status(200).send({success:true,product})
    } catch (error) {
      res.status(500).send({  
          success: false,
          message: error.message,
    })
  }
  })
module.exports = loanRouter