const { generateLoanId } = require("../helpers/otp");
const updateWalletAndLogHistory = require("../helpers/walletUpdate");
const webDevModel = require("../models/webDevModel")


const webdev = async (req, res) => {
  try {
    const applicationID = `OS${generateLoanId()}`;
    const vendorId = req.vendor.venderID;
    const vendorMongooseId = req.vendor._id;

    const amount = req.body.amount;

    // Call wallet update function (debit)
    await updateWalletAndLogHistory({
        vendorMongooseId,vendorId,
      amount,
      type: "debit",
      description: "Web Development Service Payment",
    });

    const reg = new webDevModel({
      ...req.body,
      applicationID,
      vendorId,
      vendorMongooseId,
    });

    await reg.save();

    res.status(201).send({
      success: true,
      message: "Registration success",
      reg,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

const getWeb = async(req,res)=>{
    try{
    const getWeb = await webDevModel.find()
    res.status(200).send({success : true , message : " get registration success",getWeb})
} catch (error) {
    res.status(400).send({success : false , message : error.message})
}
}

module.exports = {webdev,getWeb};