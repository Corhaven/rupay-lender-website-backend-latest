const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile :{type : Number, required : true},
    address: { type: String, required: true },
    managerCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shop', ShopSchema);