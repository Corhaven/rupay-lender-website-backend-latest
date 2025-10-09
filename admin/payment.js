const { default: mongoose } = require("mongoose");
const { notifyAdmin } = require("../helpers/socket");
const cardModel = require("../models/cardModel");
const loanModel = require("../models/loanModel");
const paymentModel = require("../models/paymentModel");
const venderModel = require("../models/venderModel");
const dayjs = require("dayjs");

const makePaymentController = async(req,res)=>{
try{
    // const vendorId = 
    const {username,mobile,referral,type,amount,transactionId,transactionDate,mode} = req.body
    const payment = await new paymentModel({username,mobile,referral,type,amount,transactionId,transactionDate,mode}).save(); 
     const user  = await venderModel.find({"basicInfo.mobile": mobile})
      notifyAdmin(user._id, 'loan subbmission',"payment successfull");
      res.status(200).send({
        success: true,
        message: "Payment done Successfully",
        payment,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message,
     
      });
}
}

const paymentHistoryController = async(req,res)=>{
  try {
    const id = req.vendor._id
    const payments = await paymentModel.findById({_id : id})
    if(!payments){
        return res.status(500).send({success:false,message:"No payment found" })
    }
    res.status(200).send({success:true,payments})
  } catch (error) {
    res.status(500).send({
        success: false,
        message: error.message,
  })
}}
const paymentLoan = async(req,res)=>{
  try {
    
    const product = await loanModel.find({'status.loanStatus' : "Completed"}).select('applicationID type status.disburstAmount status.bank utrNo uploadInvoice downLoadInvoice disbursedDate vendorInfo.referral rate payOut paidDate')

    // console.log(product)
    res.status(200).send({success:true,product})
  } catch (error) {
    res.status(500).send({
        success: false,
        message: error.message,
  })
}}
 const paymentCard = async(req,res)=>{
  try {
  
    const product = await cardModel.find({status : "approved"}).select('applicationID utrNo cardName downLoanInvoice uploadInvoice createdCard referral paidDate payOut approvedDate')
    // console.log(product)
    res.status(200).send({success:true,product})
  } catch (error) {
    res.status(500).send({
        success: false,
        message: error.message,
  })
}
 }
const unPaidLoan = async(req,res)=>{
  try {
  
    const product = await loanModel.find({'status.loanStatus' : "Completed",'paymentStatus' : "unpaid"}).select('applicationID type status.disburstAmount status.bank utrNo uploadInvoice downLoadInvoice disbursedDate payOut paidDate vendorInfo.referral')

    // console.log(product)
    res.status(200).send({success:true,product})
  } catch (error) {
    res.status(500).send({  
        success: false,
        message: error.message,
  })
}
}
const paidLoan = async(req,res)=>{
  try {
   
    const product = await loanModel.find({'status.loanStatus' : "Completed",'paymentStatus' : "paid"}).select('applicationID type status.disburstAmount status.bank utrNo uploadInvoice disbursedDate downLoadInvoice payOut paidDate vendorInfo.referral')

    // console.log(product)
    res.status(200).send({success:true,product})
  } catch (error) {
    res.status(500).send({  
        success: false,
        message: error.message,
  })
}
}
const unPaidCard = async(req,res)=>{
  try {
    // const id = req.vendor._id
    const product = await cardModel.find({'status' : "approved",'paymentStatus' : "unpaid"}).select('applicationID createdCard cardName utrNo uploadInvoice downLoadInvoice referral payOut paidDate')

    // console.log(product)
    res.status(200).send({success:true,product})
  } catch (error) {
    res.status(500).send({  
        success: false,
        message: error.message,
  })
}
}
const paidCard = async(req,res)=>{

  try {
    // const id = req.vendor._id
    
    const product = await cardModel.find({'status' : "approved",'paymentStatus' : "paid"}).select('applicationID createdCard cardName utrNo uploadInvoice downLoadInvoice referral payOut paidDate')

    // console.log(product)
    res.status(200).send({success:true,product})
  } catch (error) {
    res.status(500).send({  
        success: false,
        message: error.message,
  })
}
}
const utrUpdate = async(req,res)=>{
  try {
   const  {paidDate,utrNo} = req.body
   const {loan_Id} = req.params
   const paymentStatus = "paid"
  //  const finalPayout = await loanModel()
   const finalPayout = await loanModel.findByIdAndUpdate(loan_Id,{$set : {paidDate,utrNo,paymentStatus}},{new : true})
   res.status(200).send({success:true,finalPayout})
 } catch (error) {
   res.status(500).send({  
       success: false,
       message: error.message,
 })

 }
  
}
const uploadIncVoice = async(req,res)=>{
  try{
  const files = req.files;
  // const vendorId = req.vendor?._id
  // const vendorInfo = req.vendor?.basicInfo
  // const userDocs = { 
  const  uploadInvoice = files.uploadInvoice[0].location || " " 
const invoice =await loanModel.findByIdAndUpdate(card_Id,{$set : {paidDate,utrNo}},{new : true})
res.status(200).send({success:true,invoice})
} catch (error) {
res.status(500).send({  
    success: false,
    message: error.message,
})


}}
const caStatusChange = async (req, res) => {
  try {
    const { payout, status,  } = req.body;
    const { service,id } = req.params;
// console.log(service,id,payout, status, )

        const modelName = `${service.replace(/-/g, '')}Model`;
    
          //  const Model = mongoose.model(modelName);
    // const modelName = service.replace(/-/g, "");
let paidDate= ""
    // Get the registered Mongoose model
    if(status === "Completed"){
      paidDate = dayjs(Date.now()).format('DD-MM-YYYY')
    }
    const Model = mongoose.model(modelName);

    const updatedStatus = await Model.findOneAndUpdate(
      { _id: id }, // assuming MongoDB _id
      { payout, status,paidDate },
      { new: true }
    );

    if (!updatedStatus) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // console.log("Updated Document:", updatedStatus);
    return res.status(200).json({ success: true, data: updatedStatus });

  } catch (error) {
    console.error("Status Change Error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const otherStatusChange = async(req,res)=>{
  try {
    const { payout, status,  } = req.body;
    // const { service,id } = req.params;
// console.log(service,id,payout, status, )
        const modelName = `${service.replace(/-/g, '')}Model`;
    
          //  const Model = mongoose.model(modelName);
    // const modelName = service.replace(/-/g, "");
let paidDate= ""
    // Get the registered Mongoose model
    if(status === "Completed"){
      paidDate = dayjs(Date.now()).format('DD-MM-YYYY')
    }
    const Model = mongoose.model(modelName);

    const updatedDoc = await Model.findOneAndUpdate(
      { _id: id }, // assuming MongoDB _id
      { payout, status,paidDate },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // console.log("Updated Document:", updatedDoc);
    return res.status(200).json({ success: true, data: updatedDoc });

  } catch (error) {
    console.error("Status Change Error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
} 


// .get('/:service/:id',authMiddleware,authorize(['admin','ca','vendor']),async(req,res)=>{
//     try {
//        const {id,service} = req.params
//     const modelName = `${service.replace(/-/g, '')}Model`;

//        const Model = mongoose.model(modelName);
//         const details  = await Model.findById({_id : id})
  
//         if(!details)
//           { 
//             return res.status(404).send({success : false , message : "No details found"})
//           }
//           res.status(200).send({success : true , message : "details successfully fetch",details})
          
//         } catch (error) {
//           return res.status(404).send({success : false , message :error.message})
        
//         }
// })
module.exports = {caStatusChange,paidCard,unPaidCard,uploadIncVoice,utrUpdate,paidLoan,unPaidLoan,paymentCard,paymentLoan,makePaymentController,paymentHistoryController}