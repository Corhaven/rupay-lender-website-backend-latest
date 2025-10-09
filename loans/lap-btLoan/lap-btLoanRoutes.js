const express = require("express")
const {validator} = require("../../middlewares/validators");
// const upload = require("../../helpers/multer");
const authMiddleware = require("../../middlewares/authmiddleware");
const { submitController, submitBusinessController } = require("./lap-btLoanController");
const { lapBtBusiness, lapJobBbtobject } = require("../../helpers/imageObject");



const lap_btRouter = express.Router();

    lap_btRouter.post("/submit-job",lapJobBbtobject,authMiddleware,submitController)
    lap_btRouter.post("/submit-business",lapBtBusiness,authMiddleware,submitBusinessController)

module.exports  = lap_btRouter