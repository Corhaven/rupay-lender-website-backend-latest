const dayjs = require('dayjs');
const mongoose = require('mongoose');

const applyVisaSchema = new mongoose.Schema({
  name: String,
  pinCode: String,
  city: String,
   state: String,
  email: String,
  mobile: String,
  address: String,
  country: String,
  holder_country: String,
  passportPhotoUrl: String,
  passportUrl: String,
  amount:{
    type:Number,
  },
    status :{
           type:String,
           default:"In-Process"
          }, applicationID :{
              type : String,
          },
          amount :{
              type : String,
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
});

module.exports = mongoose.model('applyVisaModel', applyVisaSchema);
