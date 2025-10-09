const express = require("express")
const {validator} = require("../../middlewares/validators");
// const upload = require("../../helpers/multer");
const authMiddleware = require("../../middlewares/authmiddleware");
const { submitJobController, submitBusinessController } = require("./usedCarLoan_btController");
const { usedCarBtJobObject, usedCarbtBusiness } = require("../../helpers/imageObject");

const usedCarLoanbtRouter = express.Router();

// usedCarBtJobObject,usedCarbtBusiness
usedCarLoanbtRouter.post("/submit-job",usedCarBtJobObject,authMiddleware,submitJobController)
usedCarLoanbtRouter.post("/submit-business",usedCarbtBusiness,authMiddleware,submitBusinessController)


module.exports  = usedCarLoanbtRouter