const express = require("express")
// const {webdev, getWeb} = require("./webDevController")
const authMiddleware = require("../middlewares/authmiddleware")
// const uploadB2bLeads = require("../helpers/multer")
const { motorInsurance } = require("./motorInsuranceController")
const { uploadB2bLeads } = require("../helpers/multervendor")
// const { getsocialMedia, social } = require("./socialMediaController")

const motorInsuranceRouter = express.Router()
const imgObject = uploadB2bLeads.fields([
    { name: 'rc', maxCount: 1 },
    { name: 'aadhar', maxCount: 1 },
    { name: 'insurancePolicy', maxCount :1},
    ])
motorInsuranceRouter.post('/registration',imgObject,authMiddleware,motorInsurance)
// motorInsuranceRouter.get('/get-social-media',authMiddleware,getsocialMedia)


module.exports = motorInsuranceRouter