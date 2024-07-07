import Joi from "joi";

// jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills
export const addSchema = {
  body: Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string().required().equal('onsite', 'remotely', 'hybrid'),
    workingTime: Joi.string().required().equal('part-time', 'full-time'),
    seniorityLevel: Joi.string().required().equal('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
    jobDescription: Joi.string().optional(),
    technicalSkills: Joi.array().optional(),
    softSkills: Joi.array().optional(),
  })
};

export const updateSchema = {
  params: Joi.object({
    id: Joi.string().length(24).hex().required()
  })
};

export const getjobsofCompanySchema = {
  params: Joi.object({
    companyname: Joi.string().required()
  })
};

// jobTitle, jobLocation, workingTime, seniorityLevel, technicalSkills
export const filterSchema = {
  body: Joi.object({
    jobTitle: Joi.string().optional(),
    jobLocation: Joi.string().optional().equal('onsite', 'remotely', 'hybrid'),
    workingTime: Joi.string().optional().equal('part-time', 'full-time'),
    seniorityLevel: Joi.string().optional().equal('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
    technicalSkills: Joi.array().optional(),
  })
};

// jobId, userTechSkills, userSoftSkills, userResume
export const applySchema = {
  body: Joi.object({
    jobId: Joi.string().length(24).hex().required(),
    userTechSkills: Joi.array().optional(),
    userSoftSkills: Joi.array().optional(),
    userResume: Joi.string().optional(),
  })
};