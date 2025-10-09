const dayjs = require("dayjs");
const mongoose = require("mongoose");


const EventSubcriberSchema = new mongoose.Schema({
 
    email : {
        type : String
    },
    date :{
        type : String,
        // type: String, default: dayjs(Date.now()).format('DD MMM YYYY')
        default :  dayjs(Date.now()).format("DD-MMM-YYYY")
    },
    isSubcribe:{
        type: Boolean,
        default: false
    }

},{
        timestamps : true
    })
EventSubcriberSchema.index({ email: 1});
module.exports = mongoose.model("EventSubcriber",EventSubcriberSchema)