const express = require("express")

const { default: mongoose } = require("mongoose")
const authorize = require("../middlewares/role")
const authMiddleware = require("../middlewares/authmiddleware")

const { gstRouter, msmeRouter, panCardRouter, trademarkRouter, foodLicenseRouter, dscRouter, accountingTaxationRouter,businessRegistrationRouter } = require("./services/routes")
const { caStatusChange } = require("../admin/payment")


const caRouter = express.Router()

caRouter.use('/company-register',businessRegistrationRouter)
caRouter.use('/pancard',panCardRouter)
caRouter.use('/food-license-registration',foodLicenseRouter)
caRouter.use('/trademark-registration',trademarkRouter)
caRouter.use('/dsc-registration',dscRouter)
caRouter.use('/msme-registration',msmeRouter)
caRouter.use('/accounting-registration',accountingTaxationRouter)
caRouter.use('/gst',gstRouter)
caRouter.put("/update-ca-status/:service/:id",authMiddleware,authorize(['admin']),caStatusChange)

caRouter.get('/get-payment/:service',authMiddleware,async(req,res)=>{
  try {
    // console.log('ed')
    // console.log(req.params)
    const {service} = req.params
    const modelName = `${service.replace(/-/g, '')}Model`;

       const Model = mongoose.model(modelName);
    const id = req.vendor.venderID
    const product = await Model.find({vendorId : id}).select('applicationID createdAt paidDate payout name mobile amount status ')
    // console.log(product)
    res.status(200).send({success:true,product})
  } catch (error) {
    res.status(500).send({
        success: false,
        message: error.message,
  })
}
 })
caRouter.get('/:service',authMiddleware,authorize(['admin','ca','vendor']),async(req,res)=>{
    try {
      console.log(req.params)
       const {service} = req.params
    const modelName = `${service.replace(/-/g, '')}Model`;

       const Model = mongoose.model(modelName);
        const details  = await Model.find()
  
        if(!details)
          { 
            return res.status(404).send({success : false , message : "No details found"})
          }
          res.status(200).send({success : true , message : "details successfully fetch",details})
          
        } catch (error) {
          return res.status(404).send({success : false , message :error.message})
        
        }
})
caRouter.get('/:service/:id',authMiddleware,authorize(['admin','ca','vendor']),async(req,res)=>{
    try {
       const {id,service} = req.params
    const modelName = `${service.replace(/-/g, '')}Model`;

       const Model = mongoose.model(modelName);
        const details  = await Model.findById({_id : id})
  
        if(!details)
          { 
            return res.status(404).send({success : false , message : "No details found"})
          }
          res.status(200).send({success : true , message : "details successfully fetch",details})
          
        } catch (error) {
          return res.status(404).send({success : false , message :error.message})
        
        }
})

// // paid//unpaid
// caRouter.get("/get-unpaid",authMiddleware,unPaidCard)
// caRouter.get("/get-paid",authMiddleware,authorize(['admin','vendor']),paidCard)
module.exports = caRouter