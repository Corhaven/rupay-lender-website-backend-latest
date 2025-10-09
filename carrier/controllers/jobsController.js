const jobmodel = require("../model/jobmodel");

const createJobs = async (req, res) => {
    try {

        const job = new jobmodel(req.body);

        await job.save();
        res.status(201).json({ success :true, message: 'Job created successfully', job });
    } catch (error) {
        console.error(error);
        res.status(500).json({success :false, message: error.message });
    }
    }

    
const getJobs = async (req, res) => {
    try {
        const jobs = await jobmodel.find(); // Fetch all jobs
        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: err.message
        });
    }
};
const updateJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate input
        if (!id || !status) {
            return res.status(400).json({
                success: false,
                message: 'Both ID and status are required'
            });
        }

        // Correct update object structure
        const updatedJob = await jobmodel.findByIdAndUpdate(
            id,
            { $set: { status } },  // Fixed update syntax
            { new: true }
        );

        // Handle document not found
        if (!updatedJob) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedJob
        });
        
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error updating job status',
            error: err.message
        });
    }
};
module.exports = {createJobs,getJobs,updateJobStatus}