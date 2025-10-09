// import WalletHistory from "../models/WalletHistory.js";
// import User from "../models/User.js"; // or Vendor if you store wallet there
const walletHistoryModel = require("../models/walletHistoryModel")
const venderModel = require("../models/venderModel");

 const updateWalletAndLogHistory = async ({
    vendorMongooseId,vendorId,
  amount,
  type,
  description,
}) => {
  const vendor = await venderModel.findById(vendorMongooseId); // adjust to Vendor if needed
  if (!vendor) throw new Error("User not found");

  if (type === "debit" && vendor.walletBalance < amount) {
    throw new Error("Insufficient wallet balance");
  }

  const newBalance = type === "credit"
    ? vendor.walletBalance + amount
    : vendor.walletBalance - amount;

    vendor.walletBalance = newBalance;
  await vendor.save();
// console.log(vendor)
  const history = new walletHistoryModel({
    vendorMongooseId,vendorId,
    type,
    amount,
    balanceAfterTransaction: newBalance,
    description,
  });

  await history.save();
  // console.log(history)
  return history;
};


module.exports = updateWalletAndLogHistory