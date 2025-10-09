const Joi = require('joi');
const { Schema } = require('mongoose');

const personalDetailSchema = Joi.object().keys({
  username:  Joi.string().required(),
  mobile : Joi.number().required(),
  profession :  Joi.string().required(),
  loanAmount : Joi.number().required(),
  state : Joi.string().required(),
  city : Joi.string().required(),
  presentAddress : Joi.string().required(),
  pinCode : Joi.number().required(),
  email: Joi.string().email().required(),
 });
const professionalDetailSchema =  Joi.object().keys({
  company:  Joi.string().required(),
  companyName : Joi.string().required(),
  companyAddress : Joi.string().required(),
  state : Joi.string().required(),
  city : Joi.string().required(),
  pinCode : Joi.number().required(),
  officeEmail: Joi.string().email().required(),
  monthlyNetCreditSalary : Joi.number().required(),
  salaryBankAccount :Joi.string().required(),
  // annualBusinessTurnover :Joi.number().optional(),
  // businessBankAccount:Joi.string().optional()
 });
//  const runningloanSchema = Joi.object().keys({
//   runningloans:  Joi.boolean().required(),
//   bank : Joi.string().required(),
//   loanType : Joi.string().required(),
//   loanAmount : Joi.number().required(),
//   monthlyEmi : Joi.number().required(),
//   vintage : Joi.number().required(),
 
//  });
const RunningLoanDetailsSchema = new Schema({
  bank: {
    type: String,
    required: true
  },
  loanType: {
    type: String,
    required: true
  },
  loanAmount: {
    type: Number,
    required: true
  },
  monthlyEmi: {
    type: Number,
    required: true
  },
  vintage: {
    type: String,
    required: true
  }
});
 const propertyDetailSchema =Joi.object().keys({
    propertyType : Joi.string().required(),
    marketValue : Joi.number().required(),
    loanAmount : Joi.number().required(),
   
   });
   const carDetailSchema =Joi.object().keys({
    carModel : Joi.string().required(),
    marketValue_IVD : Joi.number().required(),
    loanAmount : Joi.number().required(),
    modelYear : Joi.number().required(),

   });
   const businessprofessionalDetailSchema =  Joi.object().keys({
    business:  Joi.string().required(),
    businessName : Joi.string().required(),
    businessAddress : Joi.string().required(),
    state : Joi.string().required(),
    city : Joi.string().required(),
    pinCode : Joi.number().required(),
    officeEmail: Joi.string().email().required(),
    monthlyNetCreditSalary : Joi.number().required(),
    salaryBankAccount :Joi.string().required()
   });
  //  const documentSchema = Joi.object().keys
 module.exports = {carDetailSchema,RunningLoanDetailsSchema,personalDetailSchema,businessprofessionalDetailSchema,professionalDetailSchema,propertyDetailSchema};