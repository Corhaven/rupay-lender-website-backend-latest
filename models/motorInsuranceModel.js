
const { default: mongoose } = require("mongoose")

const motorInsuranceSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    mobile : {
        type : Number,
        required : true
    },
    New_vehicle_old  : {
        type : Number,
        required : true
    },
 
    car_Bike:{
        type : String,
        required : true

    },
    brand_Name:{
        type : String,
        required : true

    },
    car_Number: {
        type : String,
        required : true

    },
   rc_Number :{
    type : String,
    required : true

   },
   manufacturing_Year :{
    type : Number,
    required : true


   },
   insuranceRenewDate :{
   type : String,
   required : true

   },
   previousInsuranceCompany:{
    type : String,
    required : true

   },
   vendorId :{
    type : String,
   },
   rc :{
    type : String,
   },
   insurancePolicy:{
    type : String,
   },
   aadhar :{
    type : String,
   }

})

module.exports = mongoose.model('motorInsuranceModel',motorInsuranceSchema)