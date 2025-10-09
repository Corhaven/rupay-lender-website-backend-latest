const express = require("express")
// const {webdev, getWeb} = require("./webDevController")
const authMiddleware = require("../middlewares/authmiddleware")
const { getsocialMedia, social, unPaidService } = require("./socialMediaController")

const socialMediaRouter = express.Router()

socialMediaRouter.post('/social-media',authMiddleware,social)
socialMediaRouter.get('/get-social-media',authMiddleware,getsocialMedia)
socialMediaRouter.get('/payment-social-media/:service',authMiddleware,unPaidService)



module.exports = socialMediaRouter