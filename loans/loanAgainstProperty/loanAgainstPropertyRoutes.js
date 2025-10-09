const express = require("express")
// const {validator} = require("../../middlewares/validators");
const {submitController, submitBusinessController} = require("./loanAgainstPropertyController");
// const upload = require("../../helpers/multer");
const authMiddleware = require("../../middlewares/authmiddleware");
const { lapBusiness, lapJobObject } = require("../../helpers/imageObject");



const loanAgainstPropertyRouter = express.Router();

loanAgainstPropertyRouter.post("/submit-job",lapJobObject,authMiddleware,submitController)
loanAgainstPropertyRouter.post("/submit-business",lapBusiness,authMiddleware,submitBusinessController)

module.exports  = loanAgainstPropertyRouter