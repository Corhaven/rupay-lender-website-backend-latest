const express = require("express")
// const {validator} = require("../../middlewares/validators");
// const upload = require("../../helpers/multer");
const authMiddleware = require("../../middlewares/authmiddleware");
const { submitJobController, submitBusinessController } = require("./usedCarLoanController");
const { usedCarObjectBusiness, usedCarObjectJob } = require("../../helpers/imageObject");

const usedCarLoanRouter = express.Router();

 
usedCarLoanRouter.post("/submit-job",usedCarObjectJob,authMiddleware,submitJobController)
usedCarLoanRouter.post("/submit-business",usedCarObjectBusiness,authMiddleware,submitBusinessController)


module.exports  = usedCarLoanRouter