const { generateLoanId } = require("../helpers/otp");
const updateWalletAndLogHistory = require("../helpers/walletUpdate");
const graphicDesignModel = require("../models/graphicDesignModel");

const graphic = async(req,res)=>{
    try{
        const { name, email, mobile, projectType,  state,amount,
        city,
        presentAddress ,
        pinCode , description } = req.body;
           const applicationID = `OS${generateLoanId()}`
        
                  const vendorId = req.vendor.venderID
                  const vendorMongooseId= req.vendor._id
        
// console.log(req.files)
  const referenceFiles =await req.files ? req.files.map(file => file.location ) : [];

    // Call wallet update function (debit)
    await updateWalletAndLogHistory({
        vendorMongooseId,vendorId,
      amount,
      type: "debit",
      description: "Graphic Design Service Payment",
    });

 

   
  
  const graphics = new graphicDesignModel({ name,applicationID,vendorId,vendorMongooseId, email, mobile, state,amount,
    city,
    presentAddress ,
    pinCode , projectType, description ,referenceFiles})
  
  await graphics.save()

  res.status(201).send({success : true , message : "registration success",graphics})
} catch (error) {
  res.status(400).send({success : false , message : error.message})
}
}

module.exports = {graphic}