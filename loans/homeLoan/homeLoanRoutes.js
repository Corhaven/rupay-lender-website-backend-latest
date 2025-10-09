const express = require("express")
const {validator} = require("../../middlewares/validators");
const {submitJobController, submitBusinessController} = require("./homeLoanController");
// const upload = require("../../helpers/multer");
const authMiddleware = require("../../middlewares/authmiddleware");
const { homeImgObjectJob, homeImgObjectBusiness } = require("../../helpers/imageObject");

const homeLoanRouter = express.Router();


homeLoanRouter.post("/submit-job",homeImgObjectJob,authMiddleware,submitJobController)
homeLoanRouter.post("/submit-business",homeImgObjectBusiness,authMiddleware,submitBusinessController)


module.exports  = homeLoanRouter