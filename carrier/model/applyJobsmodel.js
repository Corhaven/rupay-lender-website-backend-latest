const { required } = require("joi");
const { default: mongoose } = require("mongoose");

const applyJobsSchema = new mongoose.Schema({
    firstName :{
        type : String,
        required: true
    }, 
    lastName :{
        type : String,
        required: true
    }, 
    jobTitle: { 
        type: String, 
    
    },
    categories: { type: String},
    
    mobile:{
        type : Number,
        required: true
    },
    experience:{
        type : Number,
    },
    email :{
        type : String,
        required: true
    },
  
    education :{
        type : String,
        required: true
    },
    noticePeriod :{
        type : String,
    },
    currentCtc :{
        type : String,
    },
    gender  :{
        type : String,
        required: true
    },
    skills :{
        type : Array,
        required: true
    },
    currentWorking :{
        type : String,
        required: true
    },
    additionalInfo :{
        type : String,
        required: true 
    },
    cvFile :{
        type : String,
        // required: true 
    }

})
module.exports = mongoose.model('applyJobs', applyJobsSchema);
