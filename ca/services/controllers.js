
const correctionPanModel = require("../../models/correctionPanModel")
const duplicatePanModel = require("../../models/duplicatePanModel")
const gstModel = require("../../models/gstModel")
const gstReturnModel = require("../../models/gstReturnModel")
const pancardModel = require("../../models/pancardModel")
const trademarkModel = require("../../models/trademarkModel")
const msmeModel = require("../../models/msmeModel");
const businessRegistrationModel = require("../../models/businessRegistrationModel")
const foodLicenseModel = require("../../models/foodLicenseModel")
const dscModel = require("../../models/dscModel")
const accountingTaxationModel = require("../../models/accountingTaxationModel")
const { generateLoanId } = require("../../helpers/otp")
const updateWalletAndLogHistory = require("../../helpers/walletUpdate")

const tradeMark = async(req,res)=>{
    try{
      const applicationID = `CA${generateLoanId()}`
      const vendorId = req.vendor.venderID
      const vendorMongooseId= req.vendor._id
      const uploadedFiles = req.files
      const userDocs = {}
      for(let fieldName in uploadedFiles){
        userDocs[fieldName] = uploadedFiles[fieldName][0]?.location || " "; 
      }
      // console.log(req.body)
      // const vendorId = req.vendor?._id
      // const referral = req.vendor.basicInfo.referral
      const amount = req.body.amount
              await updateWalletAndLogHistory({
                vendorMongooseId,vendorId,
              amount,
              type: "debit",
              description: "Trademark Service Payment",
            });
        const trademark = new trademarkModel({...req.body,vendorId,vendorMongooseId,applicationID,userDocs
           
            // photo: req.files.photo ? req.files.photo[0].location : '',
            // pan: req.files.pan ? req.files.pan[0].location : '',
            // certificateOfRegistration: req.files.certificateOfRegistration ? req.files.certificateOfRegistration[0].location : '',
            // addressProof: req.files.addressProof ? req.files.addressProof[0].location : '',
            // logo: req.files.logo ? req.files.logo[0].location : '',
            }
        )

        await trademark.save()

        res.status(201).send({success : true , message : "registration success",trademark})
    } catch (error) {
        res.status(400).send({success : false , message : error.message})
    }

} 
const panCardregistration = async(req,res)=>{
    try {
      const applicationID = `CA${generateLoanId()}`

      const vendorId = req.vendor.venderID
      const vendorMongooseId= req.vendor._id
      const uploadedFiles = req.files
 
          const userDocs = {}
      for(let fieldName in uploadedFiles){
        userDocs[fieldName] = uploadedFiles[fieldName][0]?.location || " "; 
      }
      const amount = req.body.amount
      await updateWalletAndLogHistory({
        vendorMongooseId,vendorId,
      amount,
      type: "debit",
      description: "Pan card Service Payment",
    });
        const pancard = new pancardModel({...req.body,vendorId,vendorMongooseId,applicationID,
          userDocs,})
          await pancard.save()

          res.status(201).send({
            success : true,
            message: 'Pancard details added successfully',
            pancard
          });
        } catch (error) {
            res.status(500).send({success : false , message : error.message})
        }

   
   
   }

const duplicatePanCard = async(req,res)=>{
    try {
      const applicationID = `CA${generateLoanId()}`

      const vendorId = req.vendor.venderID
      const vendorMongooseId= req.vendor._id
      // console.log(req.files)
        const uploadedFiles = req.files
    
     
            const userDocs = {}
        for(let fieldName in uploadedFiles){
          userDocs[fieldName] = uploadedFiles[fieldName][0]?.location || " "; 
        }
          // console.log(userDocs)
          const amount = req.body.amount 
          await updateWalletAndLogHistory({
            vendorMongooseId,vendorId,
          amount,
          type: "debit",
          description: "Duplicate Pancard Service Payment",
        });
      const pancard=  new duplicatePanModel({...req.body,vendorId,vendorMongooseId,applicationID,userDocs})
        await pancard.save()
          
            if(!pancard){
              return res.status(500).send({success : false , message : "Internal Server error"})

            }
            // if(pancard)
               res.status(200).send({
              success : true,
              message: 'Pancard details added successfully',
              pancard
            });
          } catch (error) {
            res.status(400).send({success : false , message : error.message})
        }
}

const correctionPan = async(req,res)=>{
    try {
      const applicationID = `CA${generateLoanId()}`

      const vendorId = req.vendor.venderID
      const vendorMongooseId= req.vendor._id
        const uploadedFiles = req.files
    
            const userDocs = {}
        for(let fieldName in uploadedFiles){
          userDocs[fieldName] = uploadedFiles[fieldName][0]?.location || " "; 
        }
        //   console.log(userDocs)
        const amount = req.body.amount
        await updateWalletAndLogHistory({
          vendorMongooseId,vendorId,
        amount,
        type: "debit",
        description: "pan card correction Service Payment",
      });
        const pancard =   new correctionPanModel({...req.body,vendorId,vendorMongooseId,applicationID,userDocs})
      await pancard.save()
          if(pancard){
           return res.status(201).send({
              success : true,
              message: 'Pancard details added successfully',
              pancard
            });
          }
            return res.status(500).send({success : false , message : "Internal Server error"})
          } catch (error) {
            res.status(400).send({success : false , message : error.message})
        }
}
const msme  = async(req,res)=>{
    try {
      const applicationID = `CA${generateLoanId()}`

      const vendorId = req.vendor.venderID
      const vendorMongooseId= req.vendor._id
    
      const uploadedFiles = req.files
const userDocs = {}
for(let fieldName in uploadedFiles){
  userDocs[fieldName] = uploadedFiles[fieldName][0]?.location || " "; 
}
const amount = req.body.amount
await updateWalletAndLogHistory({
  vendorMongooseId,vendorId,
amount,
type: "debit",
description: "Msme Service Payment",
});
          const registration = new msmeModel({
            ...req.body,vendorId,vendorMongooseId,applicationID,userDocs
          });
    // console.log(registration)
    const reg =    await registration.save();
    if(reg){

     return res.status(201).send({success : true , message : "registration success",reg})
              
        }
        return res.status(500).send({success : false , message : "Internal Server error"})

      } catch (error) {
          res.status(400).send({success : false , message : error.message})
      }
    
    
    }

    const gstRegister = async(req, res)=>{
        try {
          const applicationID = `CA${generateLoanId()}`

          const vendorId = req.vendor.venderID
          const vendorMongooseId= req.vendor._id

            // const {mobile,email,panNumber,businessName,city,state,pinCode,iAma,amount} = req.body
        
// console.log(req.files,req.body)
const uploadedFiles = req.files
const userDocs = {}
for(let fieldName in uploadedFiles){
  userDocs[fieldName] = uploadedFiles[fieldName][0]?.location || " "; 
}
const amount = req.body.amount
await updateWalletAndLogHistory({
  vendorMongooseId,vendorId,
amount,
type: "debit",
description: "Gst Registration  Payment",
});
            const gstRegistration = new gstModel({
               ...req.body,vendorId,vendorMongooseId,applicationID,userDocs

                // panCard: req.files.panCard ? req.files.panCard[0].path : '',
                // businessRegistration: req.files.businessRegistration ? req.files.businessRegistration[0].path : '',
                // identity: req.files.identity ? req.files.identity[0].path : '',
                // pic: req.files.pic ? req.files.pic[0].path : '',
                // bankAccountStatement: req.files.bankAccountStatement ? req.files.bankAccountStatement[0].path : '',
                // addressProofofBusiness: req.files.addressProofofBusiness ? req.files.addressProofofBusiness[0].path : '',
                // addressProofofPerson: req.files.addressProofofPerson ? req.files.addressProofofPerson[0].path : ''
            });
    
            const gst = await gstRegistration.save();
        
            if(!gst){

              return res.status(500).send({success : false , message : "Internal Server error"})
              
            }
            return res.status(201).send({success : true , message : "gst registration success",gst})

        } catch (error) {
            res.status(400).send({success : false , message : error.message})
        }

}


const gstReturn = async(req,res)=>{
    
    try {
      console.log(req.vendor)
      const applicationID = `CA${generateLoanId()}`
      console.log(req.body,"wqe")
      const vendorId = req.vendor.venderID
      const vendorMongooseId= req.vendor._id
      const amount = req.body.amount
await updateWalletAndLogHistory({
  vendorMongooseId,vendorId,
amount,
type: "debit",
description: "Gst Return  Payment",
});
     const gstReturn = new gstReturnModel({...req.body,vendorId,vendorMongooseId,applicationID})
   const gst =  await gstReturn.save()
    if(!gst){

      return res.status(500).send({success : false , message : "Internal Server error"})
    }
    return res.status(201).send({success : true , message : "gst Return success",gst})

    } catch (error) {
        res.status(400).send({success : false , message : error.message})

    }
    
}

//company regitration
const businessRegistration = async(req,res)=>{
  try {
    const applicationID = `CA${generateLoanId()}`

    const vendorId = req.vendor.venderID
    const vendorMongooseId= req.vendor._id

    const uploadedFiles = req.files
    const userDocs = {}
        for(let fieldName in uploadedFiles){
          userDocs[fieldName] = uploadedFiles[fieldName][0]?.location || " "; 
        }
          // console.log(userDocs)
          const amount = req.body.amount
          await updateWalletAndLogHistory({
            vendorMongooseId,vendorId,
          amount,
          type: "debit",
          description: "Company registration  Payment",
          });
      const registration = new businessRegistrationModel({
      ...req.body,vendorId,vendorMongooseId,applicationID,userDocs
      
      });
const reg = await registration.save();
      res.status(201).send({success : true , message : "registration success",reg})
  } catch (error) {
      res.status(400).send({success : false , message : error.message})
  }



}

const foodLicenseController = async(req,res)=>{
    try {
      const applicationID = `CA${generateLoanId()}`

      const vendorId = req.vendor.venderID
      const vendorMongooseId= req.vendor._id
     const   {name,email,mobile,natureOfBusiness,designation,shopFlatDoorNo,nearBy,
        roadStreet,areaLocality,city,pinCode,state,personalEmail,contactNo,amount} = req.body
  
      const address = {shopFlatDoorNo,nearBy,
        roadStreet,areaLocality,city,pinCode,state}
  const applicantDetails = {name,personalEmail,contactNo}
  const uploadedFiles = req.files
  const userDocs = {}
      for(let fieldName in uploadedFiles){
        userDocs[fieldName] = uploadedFiles[fieldName][0]?.location || " "; 
      }
      // const amount = req.body.amount
      await updateWalletAndLogHistory({
        vendorMongooseId,vendorId,
      amount,
      type: "debit",
      description: "food  License  Payment",
      });        const registration = new foodLicenseModel({name,email,mobile,natureOfBusiness,designation,address,applicantDetails,amount,vendorId,vendorMongooseId,applicationID,userDocs
         

        });
  
        await registration.save();
        res.status(200).send({success : true , message : "food licence registration successful",registration})
      } catch (error) {
        res.status(400).send({success : false , message : error.message})
      }
}
const dsc = async(req,res)=>{
try{
  const applicationID = `CA${generateLoanId()}`

    const vendorId = req.vendor.venderID
    const vendorMongooseId= req.vendor._id
    const uploadedFiles = req.files
    const userDocs = {}
    for(let fieldName in uploadedFiles){
      userDocs[fieldName] = uploadedFiles[fieldName][0]?.location || " "; 
    }
    const amount = req.body.amount
    await updateWalletAndLogHistory({
      vendorMongooseId,vendorId,
    amount,
    type: "debit",
    description: "DSC Payment",
    });
const dsc  = new dscModel({...req.body,vendorId,vendorMongooseId,applicationID
,userDocs
   
    // proofOfIdentity: req.files.proofOfIdentity ? req.files.proofOfIdentity[0].location : '',
    // proofOfAddress: req.files.foodProductList ? req.files.proofOfAddress[0].location : '',
    // attestationOfficerProof: req.files.attestationOfficerProof ? req.files.attestationOfficerProof[0].location : '',
})

await dsc.save()
// console.log(dsc)
res.status(201).send({success : true , message : "registration success",dsc})
} catch (error) {
    res.status(400).send({success : false , message : error.message})
}
}
const taxationregistrtion = async (req, res) => {
    try {
      const applicationID = `CA${generateLoanId()}`

        const vendorId = req.vendor.venderID
        const vendorMongooseId= req.vendor._id
        const amount = req.body.amount
        await updateWalletAndLogHistory({
          vendorMongooseId,vendorId,
        amount,
        type: "debit",
        description: "Account taxation Payment",
        });
        const newEntry = new accountingTaxationModel({...req.body,vendorId,vendorMongooseId,applicationID});
        const savedEntry = await newEntry.save();

        res.status(201).send({success : true , message : "Register successfully",savedEntry})
    } catch (error) {
        res.status(400).send({success : true , message :error.message})
    }
};

   module.exports = {taxationregistrtion,dsc,foodLicenseController,businessRegistration,gstRegister,gstReturn,tradeMark,panCardregistration,duplicatePanCard,correctionPan,msme}
