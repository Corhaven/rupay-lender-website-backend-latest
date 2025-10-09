const venderModel = require("../../models/venderModel");

 const getVendorsWithoutReferral = async (req, res) => {
    try {
      const vendors = await venderModel
        .find({
          $or: [
            { "basicInfo.referral": { $exists: false } }, // Field does not exist
            { "basicInfo.referral": null },
            { "basicInfo.referral": { $exists: true, $type: "string" }, $expr: { $lt: [{ $strLenCP: "$basicInfo.referral" }, 4] } } 
          ]
        })
        .sort({ createdAt: -1 }); 
  
      // Check if any vendors were found
      if (!vendors || vendors.length === 0) {
        return res.status(404).send({ success: false, message: "No vendors without referral code found" });
      }
  
      // Send success response with the vendors
      res.status(200).send({ success: true, message: "Vendors without referral code fetched successfully", vendors });
    } catch (err) {
      // Handle errors
      res.status(500).send({ success: false, message: err.message });
    }
  };
  const vendorUpdateStatus = async (req, res) => {
    try {

  const {status } = req.body;

  if (!status) return res.status(400).send('Status is required');
//   let updateFields = { 'status.loanStatus': loanStatus  };

  
  
  const updatedStatus = await venderModel.findByIdAndUpdate(
      {_id :req.params.vendorId},
      { $set: { "basicInfo.leadStatus": status }  },
      { new: true }
  );

  res.status(200).send({success:true,message:"status change",updatedStatus})
} catch (error) {
  console.log(error.message)    
}
};
  module.exports ={getVendorsWithoutReferral,vendorUpdateStatus}