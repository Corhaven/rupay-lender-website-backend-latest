const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
notificationSchema.index({vendorId : 1})
module.exports = mongoose.model('notification', notificationSchema);

//  = Notification;
