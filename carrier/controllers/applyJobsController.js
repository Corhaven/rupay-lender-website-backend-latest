const applyJobsmodel = require("../model/applyJobsmodel");
const jobmodel = require("../model/jobmodel");

const applyJobController = async(req,res)=>{
const { firstName ,
lastName,
// jobTitle,
// categories,
mobile,
experience,
email,
education ,
noticePeriod,
currentCtc,
gender,
skills,
currentWorking,
additionalInfo  } = req.body
const {jobId} = req.params
const job = await jobmodel.findById(jobId)
if(!job){
    return res.status(404).send({message: "Job not found"})
}
const jobTitle = job?.jobTitle || ""
const categories = job?.categories || ""
if(!firstName && !mobile && !email ){
    return res.status(400).send({message: "Please fill required the fields" })
}
// console.log(req.files)
const cvFile = req?.files?.cvFile[0]?.location || ""
// console.log(cv)
const application = new applyJobsmodel({
    firstName,
    lastName,
    jobTitle,
    categories,
    mobile,
    experience,
    email,
    education,
    noticePeriod,
    currentCtc,
    gender,
    skills,
    currentWorking,
    additionalInfo,
    cvFile
});

// Save the application
const savedApplication = await application.save();

res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: savedApplication
});
}
const appliedJobs = async(req,res)=>{
    try {
        const appliedJobs = await applyJobsmodel.find({})
        if(appliedJobs.length == 0){
            res.status(500).send({success : false , message : "No Jobs"})
        }
        res.status(200).send({success : true , message : "fetch successfully jobs",appliedJobs})
    } catch (error) {
        res.status(500).send({success : false , message : error.message})
    }
} 
const wfhAppliedJob  = async(req,res)=>{
    try {
         
    } catch (error) {
        res.status(500).send({success : false , message : error.message})

    }
}
module.exports ={applyJobController,appliedJobs}