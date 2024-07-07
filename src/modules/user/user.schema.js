import Joi from "joi";

// firstName, lastName, email, password, recoveryEmail, DOB, mobileNumber, role
export const signupSchema = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
    .messages({
      "string.pattern.base":
      "Password must have at least one lowercase letter, one uppercase letter, one number and one special character",
      "any.required": "You need to provide a password",
      "string.min": "Password should have a minimum length of 3 characters",
    }),
    recoveryEmail: Joi.string().email().required(),
    DOB: Joi.date().required(),
    mobileNumber: Joi.number().required(),
    role: Joi.equal('User', 'Company_HR')
  })
};

export const confirmEmailSchema = {
  params: Joi.object({
    token: Joi.string().required()
  })
};

// email, mobileNumber, password
export const signinSchema = {
  body: Joi.object({
    email: Joi.string().email(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
    .messages({
      "string.pattern.base":
      "Password must have at least one lowercase letter, one uppercase letter, one number and one special character",
      "any.required": "You need to provide a password",
      "string.min": "Password should have a minimum length of 3 characters",
    }),
    mobileNumber: Joi.number(),
  })
};

export const getSchema = {
  params: Joi.object({
    id: Joi.string().length(24).hex().required()
  })
};

export const updatePasswordSchema = {
  body: Joi.object({
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
    .messages({
      "string.pattern.base":
      "Password must have at least one lowercase letter, one uppercase letter, one number and one special character",
      "any.required": "You need to provide a password",
      "string.min": "Password should have a minimum length of 3 characters",
    }),
  })
};

export const generateOTPSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  })
};

export const forgetPasswordSchema = {
  body: Joi.object({
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
    .messages({
      "string.pattern.base":
      "Password must have at least one lowercase letter, one uppercase letter, one number and one special character",
      "any.required": "You need to provide a password",
      "string.min": "Password should have a minimum length of 3 characters",
    }),
    otp: Joi.string().length(6).required()
  })
};

export const getAccountsSchema = {
  body: Joi.object({
    recoveryEmail: Joi.string().email().required(),
  })
};