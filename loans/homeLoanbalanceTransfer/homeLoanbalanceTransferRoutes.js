// homeLoanbalanceTransfer

const express = require("express")
const {validator} = require("../../middlewares/validators");
const  {submitJobController,submitBusinessController} = require("./homeLoanbalanceTransferController");
// const upload = require("../../helpers/multer");
const authMiddleware = require("../../middlewares/authmiddleware");
const { homebtObject2, homebtObject1 } = require("../../helpers/imageObject");




const homeLoanbalanceTransferRouter = express.Router();

homeLoanbalanceTransferRouter.post("/submit-job",homebtObject1,authMiddleware,submitJobController)
homeLoanbalanceTransferRouter.post("/submit-business",homebtObject2,authMiddleware,submitBusinessController)

module.exports  = homeLoanbalanceTransferRouter