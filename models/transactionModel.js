// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    amount: { type: Number, required: true },
    // transactionType: { type: String, enum: ['recharge', 'bill_payment'], required: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
