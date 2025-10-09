const dayjs = require("dayjs")
const mongoose = require("mongoose")
// const { currentMonthAndYearInString } = require("../../helpers/hashpassword")


const b2cStatusHistorySchema = new mongoose.Schema({
    inquiryId : { type: mongoose.Schema.Types.ObjectId, ref: 'loanInquiry', required: true },
    
    username:{
        type : String
      },

    mobile :{
        type : String
      },  
    
    applicationID :{
      type : String
    }, 
    status :{
        type: String,
        
        enum: ['pending','Called-No response',
          ,'Call back in sometime','Documents awaited',
         'Offer shared','Final verification','Disbursed','Not eligible','Reject(Due to Internal policy)','Area not sourcable','language barrier',"Cibil less than 650" 
        ,"Cibil more than 700","Overdue","Multiple loans in 6 months","Multiple inquiries"],
         default : 'pending'
        },
        referred:{
          type: String,
        },
    type :  {
      type: String,
      enum: ['personal loan', 'home loan', 'loan against property','loan against property bt',
        'used car loan','business loan','used car loan bt','education loan',
       'home loan balance transfer','personal loan balance transfer','credit card','motor insurance','web dev','used car loan','professional loan','social media','graphic design',], 
         },
     updatedDate:
     { type: String, default: dayjs(Date.now()).format('DD-MM-YYYY')},

},{timestamps:true})
module.exports =  mongoose.model('b2cStatusHistory',b2cStatusHistorySchema)