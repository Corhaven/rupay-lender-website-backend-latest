// const { currentMonthAndYearInString } = require("../helpers/hashpassword");
const dayjs = require("dayjs");
const { sendSms } = require("../helpers/message");
const { leadTextMessage, leadHtmlMessage, leadSubject } = require("../helpers/messageMail");
const { sendEmail } = require("../helpers/nodemailer");
const { generateCardId } = require("../helpers/otp");
const cardModel = require("../models/cardModel");
const createCardModel = require("../models/createCardModel");
const subAdmModel = require("../models/subAdmModel");
// const venderModel = require("../models/venderModel");

const card = async(req,res)=>{
    try{
      const {username,mobile} = req.body
      // const 
      const vendorId = req.vendor?._id
      const referral = req.vendor.basicInfo.referral
      const applicationID = `RUPL${generateCardId(6)}CC`

      const card = await cardModel({...req.body, vendorId,applicationID,referral})
 await card.save();
       
        const recipients = [
          { email:"corhaven.india@gmail.com"},
      ];
        let subAdminName = "direct lead";
        if(referral && referral.length > 4){
                const subAdm = await subAdmModel.find({referral})
                subAdminName = subAdm[0]?.username;
          subAdm.forEach(subAdm => {
            if (subAdm.email) {
                recipients.push({ email: subAdm.email });
            }
        });
      }
        // console.log(referral.referral)
      
  
   const text =await leadTextMessage(applicationID,username,subAdminName,'Credit card')
const html =await leadHtmlMessage(applicationID,username,subAdminName,'Credit card')

sendEmail(leadSubject,html,text,recipients)

   res.status(200).send({success : true , message : "registration success",card})
} catch (error) {
    res.status(400).send({success : false , message : error.message})

}}
// const getCreditcards = async(req,res)=>{
//     try {
//         const cards  = await cardModel.find()
  
//         if(!cards)
//           { 
//             return res.status(404).send({success : false , message : "No cards found"})
//           }
//           res.status(200).send({success : true , message : "cards successfully fetch",cards})
          
//         } catch (error) {
//           return res.status(404).send({success : false , message :error.message})
        
//         }
   
// }
const getVendorCards = async(req,res)=>{
    try {
        const vendorId = req.vendor?._id
        const cards  = await cardModel.find({vendorId}).sort({ createdAt: -1 })
  
        if(!cards)
          { 
            return res.status(404).send({success : false , message : "No cards found"})
          }
          res.status(200).send({success : true , message : "cards successfully fetch",cards})
          
        } catch (error) {
          return res.status(404).send({success : false , message :error.message})
        
        }
   
}
const createCard = async(req,res)=>{
    try {
        const {bankName,benefits, cardName,fee
,link,tags} = req.body
        // req.files.proofOfIdentity ? req.files.proofOfIdentity[0].location : '',
        const image = req.files.image ? req.files.image[0].location : " ";
        // const logo = req.files.logo ? req.files.logo[0].location : ''
       const card  = new createCardModel({
       bankName,benefits, cardName,fee
,link,tags,image
       })
       await card.save()
       res.status(200).send({success : true , message : "cards update fetch",card})
          
    } catch (error) {
      return res.status(500).send({success : false , message :error.message})
    
    }
}

const getCards = async(req,res)=>{
try {
    const cards  = await createCardModel.find()

    if(!cards){
        return res.status(400).send({success : false , message : "No cards found"})
    }
  res.status(200).send({success : true , message : "cards update fetch",cards})
          
    } catch (error) {
      return res.status(500).send({success : false , message :error.message})
    
    }
}
const updateCard = async(req,res)=>{
    try {
        const {fee,link} = req.body
        const {card_id} = req.params
        // const updated
        
        const updateCards = await createCardModel.findByIdAndUpdate(card_id,{$set :{link,fee}},{new : true})
        console.log(updateCards)
        res.status(200).send({success : true , message : "cards update fetch",updateCards})
          
    } catch (error) {
      return res.status(500).send({success : false , message :error.message})
    
    }
}
const  getcardDetail = async(req,res)=>{
    try {
        const {card_id} = req.params
        const card = await cardModel.findById({_id : card_id})
  if(!card){
    return res.status(500).send({success : false , message :"cards details not fetch"})

  }
  res.status(200).send({success : true , message : "cards update fetch",card})

    } catch (error) {
        return res.status(500).send({success : false , message :error.message})

    }
}


const updateStatus = async(req,res)=>{
    try {
        const {card_id} = req.params
        const {status} = req.body

        if (!status) return res.status(400).send('Status is required');
        const card = await cardModel.findById({_id : card_id})

        if (status === 'approved') {
           card.approvedDate = dayjs(Date.now()).format('DD-MM-YYYY')
          //  card.paymentStatus = "paid"
           await card.save();
                  const message = `We are pleased to inform you that your lead application Id ${card.applicationID} with Rupay Lender has been successfully completed. Thank you for choosing us as your financial partner. please check on- https://bit.ly/4cXvmRb`
                  // console.log(message ,card.mobile)
                  await sendSms(message ,card?.mobile)
        // } else if (loanStatus === 'process' || loanStatus === 'cancel') {
            } 
            else if (status === 'In-progess') {
      
      const message = `Your lead application ID ${card?.applicationID} is currently in progress. We will keep you updated on Rupay Lender. For more information, check: https://bit.ly/4cXvmRb.`

      
            await sendSms(message,card?.mobile)
        
       
        }else  if (status === 'declined') {
          
          const message =`We regret to inform you that your lead application Id ${card.applicationID} has been canceled on rupay lender. For more information, please check in- https://bit.ly/4cXvmRb`
          await sendSms(message,card?.mobile)
      
      
      
        } 
        //  const updatedCard = await cardModel.findByIdAndUpdate({_id : card_id},{$set : {status}},{new : true})
        // if(!card){
        //   return res.status(500).send({success : false , message :"cards details not fetch"})
      
        // }
        card.status = status
        await card.save()
        res.status(200).send({success : true , message : "cards update fetch",card})
      
          } catch (error) {
              return res.status(500).send({success : false , message :error.message})
      
          }
}
const unPaidCard = async(req,res)=>{
  try {
    const id = req.vendor._id
    const product = await cardModel.find({'status' : "approved",'paymentStatus' : "unpaid",vendorId : id}).select('applicationID createdCard cardName utrNo uploadInvoice downLoadInvoice referral payOut paidDate')

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
    const id = req.vendor._id
    
    const product = await cardModel.find({'status' : "approved",'paymentStatus' : "paid",vendorId : id}).select('applicationID createdCard cardName utrNo uploadInvoice downLoadInvoice referral payOut paidDate')

    // console.log(product)
    res.status(200).send({success:true,product})
  } catch (error) {
    res.status(500).send({  
        success: false,
        message: error.message,
  })
}
}
const  editCommission = async(req,res)=>{
  try{
  const {payOut} = req.body
  const {card_Id} = req.params

  const commision = await cardModel.findByIdAndUpdate(card_Id,{$set : {payOut}},{new : true})
  res.status(200).send({success:true,commision})
} catch (error) {
  res.status(500).send({  
      success: false,
      message: error.message,
})
}}
const utrUpdate = async(req,res)=>{
  try {
   const  {paidDate,utrNo} = req.body
   const {card_Id} = req.params
  //  const finalPayout = await loanModel()
   const finalPayout = await cardModel.findByIdAndUpdate(card_Id,{$set : {paidDate,utrNo,paymentStatus:"paid"}},{new : true})
   res.status(200).send({success:true,message :" utr no. update",finalPayout})
 } catch (error) {
   res.status(500).send({  
       success: false,
       message: error.message,
 })

 }
  
}
const uploadIncVoiceCard = async(req,res)=>{
  try{
  const files = req.files;
  const {card_Id} = req.params
  // const vendorId = req.vendor?._id
  // const vendorInfo = req.vendor?.basicInfo
  // const userDocs = { 
  const  uploadInvoice = files.uploadInvoice[0].location || " " 
const invoice =await cardModel.findByIdAndUpdate(card_Id,{$set : {uploadInvoice}},{new : true})
res.status(200).send({success:true,message:"updload invoice successfully",invoice})
} catch (error) {
res.status(500).send({  
    success: false,
    message: error.message,
})


}}
module.exports ={utrUpdate,uploadIncVoiceCard,editCommission,paidCard,unPaidCard,updateStatus,getcardDetail,getVendorCards,getCards,card,createCard,updateCard}