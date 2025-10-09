const express  = require("express")

const { applyJobController, appliedJobs } = require("./controllers/applyJobsController")

const upload = require("../helpers/multer")

const { createJobs, getJobs, updateJobStatus } = require("./controllers/jobsController")

const authMiddleware = require("../middlewares/authmiddleware")

const authorize = require("../middlewares/role")

const { telecallers, sendOtp, verifyOtp, getLoans, getProfile } = require("./controllers/wfhController")

const { cpLoad } = require("../helpers/imageObject")

const otpMiddleware = require("../middlewares/otpmiddleware")  
const { uploadtelecaller } = require("../helpers/multervendor")

const carrierRouter = express.Router();

const imgTellecaller = uploadtelecaller.fields([
  { name: 'cv', maxCount: 1 }
])

const Img = uploadtelecaller.fields([
    { name: 'cvFile', maxCount: 1 }
]) 

carrierRouter.post("/apply-jobs/:jobId",Img,applyJobController)  
carrierRouter.post('/create-job',createJobs);
carrierRouter.get('/jobs',getJobs);
carrierRouter.get('/get-profile',authMiddleware,getProfile);

carrierRouter.get("/get-applied-jobs",authMiddleware,authorize(["admin"]),appliedJobs)
carrierRouter.post("/apply-telecaller",imgTellecaller,telecallers)
carrierRouter.post("/send-otp",sendOtp)
carrierRouter.post("/verify-otp",otpMiddleware,verifyOtp)
carrierRouter.get("/get-loans",authMiddleware,getLoans)
carrierRouter.put("/update-job-status/:id",authMiddleware,updateJobStatus)
module.exports = carrierRouter;