const express = require("express")
const authMiddleware = require("../middlewares/authmiddleware")
const authorize = require("../middlewares/role")
const {login,allVendors,getId,searchvendorController, createSubAdmin, getAllSubadmin, createAdmin, refferOffer, updateVendorStatus, uploadBanks, uploadBankerList, moveVenders, alltelecaller, verifyEmail, updateSubAdmin, deleteSubAdmin, telecallerLead} = require("./login")
const { getsingleLoan, updateStatus, getvendorProfileController,getTelecallerProfileController,  getStatusHistory, searchProductController, getAllLoans, getSingleServices, getServices,editLoanrate } = require("./getloans")
const { makePaymentController, paymentHistoryController,paymentCard, paymentLoan, utrUpdate, paidLoan, unPaidLoan, unPaidCard, paidCard, caStatusChange} = require("./payment")
const notificationController = require("./notification")
const { createBlog } = require("./blog")
const upload = require("../helpers/multer")
const multer = require("multer")
const otpMiddleware = require("../middlewares/otpmiddleware")
const loanModel = require("../models/loanModel")
const { uploadBlog } = require("../helpers/multervendor")
const adminRouter = express.Router()
 adminRouter.get("/telecaller-lead",telecallerLead) 
adminRouter.post("/create-Admin",createAdmin)
adminRouter.post("/create-sub-admin",authMiddleware,authorize(['admin']),createSubAdmin)
adminRouter.post('/update-status/:id',authMiddleware, authorize(['admin']), updateSubAdmin);

// Delete subadmin
adminRouter.delete('/sub-admin/:id', authMiddleware, authorize(['admin']),deleteSubAdmin);

adminRouter.post("/login-Admin",login)
adminRouter.post("/verify-email",otpMiddleware,verifyEmail)


adminRouter.get("/get-id",authMiddleware,authorize(['admin','backend','verifier','manager']),getId)
adminRouter.get("/all-vendors",authMiddleware,authorize(['admin']),allVendors)
adminRouter.get("/all-telecaller",authMiddleware,authorize(['admin']),alltelecaller)
adminRouter.get("/all-subadmin",authMiddleware,authorize(['admin']),getAllSubadmin)
adminRouter.get("/get-vendor-profile/:vendorId",authMiddleware,authorize(['admin','salesMan']),getvendorProfileController) 
adminRouter.get("/get-telecaller-profile/:vendorId",authMiddleware,authorize(['admin','salesMan']),getTelecallerProfileController) 

// get all loans
adminRouter.get("/get-loans/:loanType",authMiddleware,authorize(['admin']),getAllLoans)
// single loan
adminRouter.get("/get-single-loan/:loanId",authMiddleware,authorize(['admin','backend','manager','verifier']),getsingleLoan)
//update staus
adminRouter.put("/update-status/:loanId",authMiddleware,authorize(['admin','backend','verifier']),updateStatus)
adminRouter.get("/get-status-history/:loanId",authMiddleware,authorize(['admin']),getStatusHistory)
//////// upadte  commision
adminRouter.put("/update-loan-commission/:loanId",authMiddleware,authorize(['admin']),editLoanrate)
adminRouter.put("/update-ca-status/:service/:id",authMiddleware,authorize(['admin']),caStatusChange)
adminRouter.put("/update-other-service-status/:service/:id",authMiddleware,authorize(['admin']),caStatusChange)
// payment
adminRouter.post("/make-payment",authMiddleware,authorize(['admin']),makePaymentController)
adminRouter.get("/payment-history",authMiddleware,authorize(['admin']),paymentHistoryController)
adminRouter.get("/get-loan-payment",authMiddleware,authorize(['admin','backend','manager']),paymentLoan)
adminRouter.get("/get-paid-loan-payment",authMiddleware,authorize(['admin','backend','manager']),paidLoan)
adminRouter.get("/get-unpaid-loan-payment",authMiddleware,authorize(['admin','backend','manager']),unPaidLoan)
adminRouter.get("/get-card-payment",authMiddleware,authorize(['admin','backend','manager']),paymentCard)
adminRouter.get("/get-unpaid-card-payment",authMiddleware,authorize(['admin','backend','manager']),unPaidCard)
adminRouter.get("/get-paid-card-payment",authMiddleware,authorize(['admin','backend','manager']),paidCard)

adminRouter.post("/loan-payout/:loan_Id",authMiddleware,authorize(['admin','backend']),utrUpdate)
// notification
adminRouter.get("/notifications",authMiddleware,authorize(['admin','backend']),notificationController)
//search
adminRouter.get("/search/:keyword",authMiddleware,authorize(['admin','backend']),searchProductController)
adminRouter.get("/search-vendor/:keyword",authMiddleware,authorize(['admin','backend']),searchvendorController)
//blog
const imgObject = uploadBlog.fields([
    { name: 'image', maxCount: 1 },
    ])
adminRouter.post("/create-blog",authMiddleware,imgObject,authorize(['admin','blogger']),createBlog)
    // getBlog
 adminRouter.get("/:service/:id",authMiddleware,authorize(['admin']),getSingleServices)  
 adminRouter.get("/:service",authMiddleware,authorize(['admin']),getServices)   
 ///////////
 adminRouter.post("/create-referral-offer",authMiddleware,authorize(['admin',]),refferOffer)
 adminRouter.put("/update-vendor-status/:id",updateVendorStatus)
////////////////////////////
const uploads = multer({ dest: 'uploads/' });
adminRouter.post('/upload', uploads.single('file'),uploadBanks)
adminRouter.post('/upload-banker',uploads.single('file'),uploadBankerList)
adminRouter.post("/change-referral", moveVenders)   
////////////////////////////
//  adminRouter.get("/telecaller-loans",async(req,res)=>{
//     console.log("edf")
//     const loans = await loanModel.find({role:"telecaller"})
//     return    res.status(200).send({success : true , message : "telecaller successfully fetch",loans})
//  })   

module.exports = adminRouter
