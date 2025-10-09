const notificationModel = require("../models/notificationModel");

const notificationController = async(req,res)=>{
    try {
      
        const notifications = await notificationModel.find().sort({ createdAt: -1 }); // Sort by createdAt descending
     
        res.status(200).json(notifications);
      } catch (error) {
        console.error(error);
        res.status(500).send({success : false, message : error.message});
      }
}
module.exports = notificationController