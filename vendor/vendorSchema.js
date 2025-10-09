const Joi = require('joi');


const signupSchema = Joi.object().keys({
  username:  Joi.string().required(),
  email: Joi.string().email().required(),
  mobile : Joi.number().required(),
  password :Joi.string().required(),
  plan: Joi.string().optional(),
  state : Joi.string().required(),
  city : Joi.string().required(),
  pinCode : Joi.number().required(),
  address : Joi.string().required(),
   experience : Joi.boolean().optional(),
   referral :Joi.string().optional()
 });

 const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const companyDetailSchema = Joi.object({
  companyName: Joi.string().required(),
  companyEmail :Joi.string().email().required(),
  companyAddress: Joi.string().required(),
  companyPinCode :Joi.number().required(),
});

const bankDetailSchema = Joi.object({
  bankName: Joi.string().required(),
  accountNumber: Joi.number().required(),
  ifscCode: Joi.string().required(),
  bankAddress : Joi.string().required(),
});

const basicInfoSchema = Joi.object({
  username:  Joi.string().required(),
  email: Joi.string().email().required(),
  mobile : Joi.number().required(),
  qualification : Joi.string().required(),
  company: Joi.string().optional(),
  state : Joi.string().required(),
  city : Joi.string().required(),
  pinCode : Joi.number().required(),
  address : Joi.string().required(),
   experience : Joi.boolean().optional(),
});

const profileSchema = Joi.object({
  basicInfo: basicInfoSchema,
  companyDetail: companyDetailSchema,
  bankDetail: bankDetailSchema
});

// module.exports = { profileSchema };
 
 module.exports = {loginSchema,basicInfoSchema,bankDetailSchema,companyDetailSchema,signupSchema,profileSchema};