const { default: mongoose } = require("mongoose")
const dayjs = require("dayjs")

const statusHistoryScehma =new mongoose.Schema({
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'loan', required: true },

    loanStatus :{
      type: String,
    },
    disburstAmount : {
      type : Number
    },
    reason : {
      type : String
    },
    bank : {
      type : String
    },
    reuploadDocs :{
      type : [String],
      enum : [ 'panCard','aadharfront',' aadharback','payslip1' ,'payslip2',
        'payslip3','sevenMonthStatement',	'form16' , 'form26', 'closerLetter1', 
        'closerLetter2','closerLetter3','propertyChain' ,'map', 'gstMsmeCerificate',
        'itrComution1','itrComution2', 'itrComution3','oneBankStatementCurrentAccount' ,'oneYearSavingAccountStatement', 'sanctionLetter' ,'insurancePolicy','rc',]
    }, 
     changeStatus:
    { type: String, default: dayjs(Date.now()).format('DD MMM YYYY')  },
  },{timestamps:true})
  module.exports = mongoose.model('statusHistory',statusHistoryScehma)