const express = require("express")
const {webdev, getWeb} = require("./webDevController")
const authMiddleware = require("../middlewares/authmiddleware")

const webdevRouter = express.Router()

webdevRouter.post('/webdev',authMiddleware,webdev)
webdevRouter.get('/get-webdev',authMiddleware,getWeb)


module.exports = webdevRouter