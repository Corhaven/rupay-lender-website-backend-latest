const dayjs = require('dayjs');
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    // cinNumber: row['CIN Number'],
    // companyName: row['Company Name'],
    // companyCategory: row['Company Category'],
    // date: row['Date'] ? new Date(row['Date']) : null, // Convert Date column to a Date object
    // remarks: row['Remarks']
  cinNumber: {
    type: String,
  
  },
  companyName: {
    type: String,
    index: true
  },
  companyCategory: {
    type: String,
   
  },
  date: {
    type: Date,
   
  },
  remarks: {
    type: String,
    
  },
 
}, {
  timestamps: true
});
// companySchema.index({ companyName: 1});

module.exports = mongoose.model('Company', companySchema);
