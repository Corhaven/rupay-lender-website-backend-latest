// admin@rupaylender.com
const express = require("express")
const {updateStatus, card ,createCard, getCards,updateCard, getVendorCards,getcardDetail, unPaidCard, paidCard, editCommission, uploadIncVoiceCard, utrUpdate} = require("./cardContoller")
const authMiddleware = require("../middlewares/authmiddleware")
const authorize = require("../middlewares/role")
const upload = require("../helpers/multer")
const loanModel = require("../models/loanModel")
const cardModel = require("../models/cardModel")
const createCardModel = require("../models/createCardModel")
const { uploadB2bLeads } = require("../helpers/multervendor")
// const { paymentCard, paymentLoan, unPaidLoan, paidLoan } = require("../admin/payment")

const cardRouter = express.Router()

const Img = upload.fields([

   { 'name' : 'image',maxCount : 1},
    {'name' : 'logo' ,maxCount : 1}
]
)
// lead submission
cardRouter.post('/credit-card',authMiddleware,card)
// cardRouter.get('/get-credit-card',authMiddleware,authorize(['admin']),getCreditcards)
cardRouter.get("/get-card-detail/:card_id",authMiddleware,getcardDetail)
cardRouter.get('/get-card-history',authMiddleware,getVendorCards)
cardRouter.put("/update-status/:card_id",authMiddleware,authorize(['admin']),updateStatus)
// cardRouter.post('/credit-card',authMiddleware,card)

//// create cards
cardRouter.post("/create-card",Img,authMiddleware,authorize(['admin']),createCard)
cardRouter.put("/update-card/:card_id",Img,authMiddleware,authorize(['admin']),updateCard)
cardRouter.get("/get-cards",getCards)

cardRouter.delete("/delete/:id", async (req, res) => {
  try {
    const card = await createCardModel.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ success: false, message: "Card not found" });
    res.status(200).json({ success: true, message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ success: false, message: "Failed to delete card" });
  }
});

cardRouter.get("/filter", async (req, res) => {
  try {
    const { banks } = req.query;
    console.log(banks)
    let filter = {};

    if (banks) {
      const bankArray = banks.split(",");
      filter.bankName = { $in: bankArray };
    }
console.log(filter)
    const cards = await createCardModel.find(filter);
    res.json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
cardRouter.get("/get-card-payment",authMiddleware,async(req,res)=>{
    try {
      const id = req.vendor._id
      const product = await cardModel.find({status : "approved",vendorId : id}).select('applicationID utrNo cardName downLoanInvoice uploadInvoice createdCard referral paidDate payOut approvedDate')
      // console.log(product)
      res.status(200).send({success:true,product})
    } catch (error) {
      res.status(500).send({
          success: false,
          message: error.message,
    })
  }
   })
// paid//unpaid
cardRouter.get("/get-unpaid-card",authMiddleware,unPaidCard)
cardRouter.get("/get-paid-card",authMiddleware,authorize(['admin','vendor']),paidCard)
// cardRouter.get("/get-paid-loan",authMiddleware,authorize(['admin','vendor']),paidLoan)
cardRouter.post("/get-edit-commision/:card_Id",authMiddleware,editCommission)

const invoice = uploadB2bLeads.fields([
    
    { 'name' : 'uploadInvoice',maxCount : 1},
]
)
cardRouter.put("/upload-invoice-card/:card_Id",invoice,authMiddleware,uploadIncVoiceCard)
cardRouter.post("/card-payout/:card_Id",authMiddleware,utrUpdate)
cardRouter.get("/get-loan-payment",authMiddleware,async(req,res)=>{
    try {
      const id = req.vendor._id
      const product = await loanModel.find({'status.loanStatus' : "Completed",vendorId : id}).select('applicationID type status.disburstAmount status.bank utrNo uploadInvoice downLoadInvoice disbursedDate vendorInfo.referral rate payOut paidDate')
  
      // console.log(product)
      res.status(200).send({success:true,product})
    } catch (error) {
      res.status(500).send({
          success: false,
          message: error.message,
    })
  }})
module.exports = cardRouter