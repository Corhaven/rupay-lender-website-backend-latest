// upload.array('files', 5), async (req, res) => {
//     try {
//       const fileDetails = req.files.map(file => file.location);

const express = require("express")
const upload = require("../helpers/multer")
const { graphic } = require("./graphicDesignController")
const authMiddleware = require("../middlewares/authmiddleware")

const graphicDesignRouter = express.Router()

graphicDesignRouter.post("/create",upload.array('referenceFiles',5),authMiddleware,graphic)

module.exports =graphicDesignRouter