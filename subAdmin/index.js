// checkDepartment('personal loan'),
const express = require("express")
const {login, allVendors, getmangerLoans, searchLoanController, commisionRate, getvendorController, getBanks,getmanager, movedTo, getMovedData, getGrade, getBankerList, getpendings, getRework, verifyEmail, updateRemarks, getTelecallerLead, getTelecallers} = require("./login")
const authMiddleware = require("../middlewares/authmiddleware")
const authorize = require("../middlewares/role")
const {getProfileController, getsingleLoan, getStatusHistory, updateStatus, searchProductController, getvendorProfileController } = require("../admin/getloans")
// const checkDepartment = require("../middlewares/checkDepartment")
// const { searchvendorController } = require("../admin/login")
const venderModel = require("../models/venderModel")
// const upload = require("../helpers/multer")
const { cpLoad, imgObject, homeImgObjectJob, homeImgObjectBusiness, homebtObject1, homebtObject2, businessimgObject, lapJobObject, lapBusiness, usedCarObjectBusiness, usedCarObjectJob, usedCarbtBusiness, usedCarBtJobObject, lapBtBusiness, lapJobBbtobject } = require("../helpers/imageObject")
const { personalLoanController, personalLoanbtController, homeJob, homeBusiness, homebtBusinessController, homebtJobController, businessController, lapJobController, lapBusinessController, usedCarJob, usedCarBusiness, lapbtJob, lapbtBusinessController, usedcarBtBusinessController, usedCarbtJobControllerusedCarBusiness, usedCarbtJobController } = require("./createLead")
const otpMiddleware = require("../middlewares/otpmiddleware")
const { uploadEvent } = require("../helpers/multervendor")
// const companyModel = require("../models/companyModel")


const subAdminRouter = express.Router()
// subAdminRouter.use(express.json())
subAdminRouter.post("/login",login)
subAdminRouter.post("/verify-email",otpMiddleware,verifyEmail)

subAdminRouter.get("/all-vendors",authMiddleware,authorize(['manager','Franchise Manager','distributor']),allVendors)
subAdminRouter.post("/update-remarks/:id",authMiddleware,authorize(['Franchise Manager']),updateRemarks)



subAdminRouter.get("/vendor-profile/:vendorId",authMiddleware,authorize(['manager','Franchise Manager','distributor']),getvendorProfileController)
subAdminRouter.get("/profile",authMiddleware,authorize(['manager','Franchise Manager','distributor','Network Lead Manager']),getProfileController)
subAdminRouter.post("/vendor-lead",getvendorController)
subAdminRouter.post("/personal-loan-lead/:mobile",authMiddleware,cpLoad,personalLoanController)
subAdminRouter.post("/personal-loan-bt-lead/:mobile",authMiddleware,imgObject,personalLoanbtController)

subAdminRouter.post("/home-job/:mobile",authMiddleware,homeImgObjectJob,homeJob)
subAdminRouter.post("/home-business/:mobile",authMiddleware,homeImgObjectBusiness,homeBusiness)
subAdminRouter.post("/home-job-bt/:mobile",authMiddleware,homebtObject1,homebtJobController)
subAdminRouter.post("/home-business-bt/:mobile",authMiddleware,homebtObject2,homebtBusinessController)

subAdminRouter.post("/business-loan/:mobile",authMiddleware,businessimgObject, businessController)
//      
subAdminRouter.post("/lap-job/:mobile",authMiddleware,lapJobObject,lapJobController)
subAdminRouter.post("/lap-business/:mobile",authMiddleware,lapBusiness,lapBusinessController)
subAdminRouter.post("/lap-job-bt/:mobile",authMiddleware,lapJobBbtobject,lapbtJob)
subAdminRouter.post("/lap-business-bt/:mobile",authMiddleware,lapBtBusiness,lapbtBusinessController)
subAdminRouter.post("/used-car-job/:mobile",authMiddleware,usedCarObjectJob,usedCarJob)
subAdminRouter.post("/used-car-business/:mobile",authMiddleware,usedCarObjectBusiness,usedCarBusiness)
subAdminRouter.post("/used-car-bt-job/:mobile",authMiddleware,usedCarBtJobObject,usedCarbtJobController)
subAdminRouter.post("/used-car-bt-business/:mobile",authMiddleware,usedCarbtBusiness,usedcarBtBusinessController)
subAdminRouter.get("/manager-loans/:loanType",authMiddleware,authorize(['B2B Lead Manager','verifier','backend','distributor']),getmangerLoans)
subAdminRouter.get("/get-single-loan/:loanId",authMiddleware,authorize(['backend','verifier','manager','Network Lead Manager']),
getsingleLoan)
//update status
subAdminRouter.put("/update-status/:loanId",authMiddleware,authorize(['backend','verifier','manager']),updateStatus)
subAdminRouter.get("/get-status-history/:loanId",authMiddleware,authorize(['backend','verifier','manager']),getStatusHistory)

// search

subAdminRouter.get("/search/:keyword",authMiddleware,authorize(['admin','backend','manager']),searchLoanController)
subAdminRouter.get("/search-vendor/:keyword",authMiddleware,authorize(['manager']),async (req, res) => {
    try {
      const { keyword } = req.params;
      const regexKeyword = new RegExp(keyword, 'i'); // Create a regex from the keyword
    // const refe
      const resutls = await venderModel
        .find({
            $and: [
                { referral: req.vendor.referral }, // Filter by referral
                {
                    $or: [
                        { 'basicInfo.city': { $regex: regexKeyword } },
                        { 'basicInfo.state': { $regex: regexKeyword } },
                        { 'basicInfo.username': { $regex: regexKeyword } },
                        { $expr: { $regexMatch: { input: { $toString: "$basicInfo.mobile" }, regex: keyword, options: "i" } } },
                      ],
                },
              ],
      
        //   $or: [
        //     { 'basicInfo.city': { $regex: regexKeyword } },
        //     { 'basicInfo.state': { $regex: regexKeyword } },
        //     { 'basicInfo.username': { $regex: regexKeyword } },
        //     { 'referral': { $regex: regexKeyword } },
        //     { $expr: { $regexMatch: { input: { $toString: "$basicInfo.mobile" }, regex: keyword, options: "i" } } },
        //   ],
           
        })
        .select("-photo");
      res.json(resutls);
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error In Search Product API",
        error,
      });
    }
  })
subAdminRouter.put("/create-commision/:vendorId",commisionRate)
subAdminRouter.get('/search',getBanks)
subAdminRouter.patch('/move-to/:id',authMiddleware,movedTo)
subAdminRouter.get('/moved-data',authMiddleware,getMovedData)
subAdminRouter.get('/get-manager',authMiddleware,getmanager)
subAdminRouter.get('/get-grade/:companyName',getGrade)
subAdminRouter.get("/get-banker",getBankerList)
subAdminRouter.get("/get-pendings",authMiddleware,getpendings)
subAdminRouter.get("/get-telecaller-lead",authMiddleware,getTelecallerLead)
subAdminRouter.get("/get-rework",authMiddleware,getRework)
subAdminRouter.get("/get-telecallers",authMiddleware,getTelecallers)



// convert image to link
subAdminRouter.post("/upload",uploadEvent.single('file'),(req, res) => {
    try {
      const file = req.file;
      if (!file) {          
        return res.status(400).send({ success: false, message: "No file uploaded" });
      }
      const imageUrl = file.location; // Assuming the file is uploaded to a service like AWS
      res.status(200).send({ success: true, message: "File uploaded successfully",
        imageUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send({ success: false, message: "Error uploading file",
        error: error.message });
    }
  })

module.exports = subAdminRouter