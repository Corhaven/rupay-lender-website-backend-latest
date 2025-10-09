const dayjs = require('dayjs');
const mongoose = require('mongoose');
// const { currentMonthAndYearInString } = require('../../helpers/hashpassword');

const jobSchema = new mongoose.Schema({
    jobTitle: { type: String, required: true },
    location: { type: String, required: true },
    categories: { type: String, required: true },
    postedOn:   { type: String, default: dayjs(Date.now()).format('DD-MM-YYYY') },
    experience: { type: String, required: true },
    whatWeLooking: { type: [String], required: true },
    whatWillBeDoing: { type: String, required: true },
    bonusPoints: { type: String },
    education: { type: String, required: true },
    salary: { type: String, required: true },
    workingHours: { type: String, required: true },
    workingDays: { type: String, required: true },
    perksAndBenefits: { type: String, required: true },
    applicationProcess: { type: String, required: true },
    ourStatement: { type: String, required: true },
    jobType: { type: String, required: true },
    vacancy: { type: Number, required: true },
        status: { type: String, default:"Open" },

},{timestamps:true});

module.exports  = mongoose.model('job', jobSchema);
