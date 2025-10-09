const { default: mongoose } = require("mongoose")
// const { currentMonthAndYearInString } = require("../helpers/hashpassword")
const dayjs = require("dayjs")

const socialMediaSchema = new mongoose.Schema({
   name :{
    type : String,
    required : true
   },
   address :{
    type : String,
    required : true  
 },
  
 typeOfWebsite :{
    type : String,
    required : true 
},
instagam:{
    type:String,
},
facebook:{
    type:String,

},

twitter:{
    type:String,

},
linkedin :{
    type:String,

},whatsupp :{
    type:String,
},
telegram :{
    type:String,
},
otherLinks :{
    type:String,

},
    pinCode :{
        type : Number,
        required : true
    },
    city :{
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
 
    email :{
        type : String,
        required : true
    },
    mobile : {
        type : Number,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
//     vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'vendor', required: true },
    applicationID :{
      type : String,
  },

   status :{
     type:String,
     default:"In-Process"
    },
    payout:{
        type: Number,
    },    
    paidDate :{type: String},
        
     vendorMongooseId:{
            type: mongoose.Schema.Types.ObjectId, ref: 'vendor', required: true 
        },
    vendorId :{
            type:String,
            required:true
        },
    createdAt:{
            type:String,
            default:dayjs(Date.now()).format("MMM D, YYYY h:mm A")
        }
 
},{timestamps:true})

module.exports = mongoose.model('socialMediaModel',socialMediaSchema)