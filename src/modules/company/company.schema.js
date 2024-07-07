import Joi from "joi";

// companyName, description, industry, address, numberOfEmployees, companyEmail
export const addSchema = {
  body: Joi.object({
    companyName: Joi.string().required(),
    description: Joi.string().optional(),
    industry: Joi.string().optional(),
    address: Joi.string().optional(),
    numberOfEmployees: Joi.string().required(),
    companyEmail: Joi.string().email(),
  })
};

export const getSchema = {
  params: Joi.object({
    id: Joi.string().length(24).hex().required()
  })
};

export const searchSchema = {
  params: Joi.object({
    companyname: Joi.string().required()
  })
};