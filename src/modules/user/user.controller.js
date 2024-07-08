import User from '../../../database/models/user.model.js'
import bcrypt from 'bcryptjs'
import { sendEmailService } from '../../services/send-email.service.js'
import { ErrorClass } from '../../utils/error-class.utils.js'
import jwt from 'jsonwebtoken'
import OTP from '../../../database/models/otp.model.js'
import { otp } from '../../services/generate-otp.service.js'
import Job from '../../../database/models/job.model.js'
import Company from '../../../database/models/company.model.js'
import Application from '../../../database/models/application.model.js'


export const signup = async (req, res, next)=>{
    // destruct data from req.body
    const { firstName, lastName, email, password, recoveryEmail, DOB, mobileNumber, role } = req.body

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS)

    // check if the email or mobile number is already exists
    const isUserExist = await User.findOne({ $or: [ { email }, { mobileNumber } ] })
    if (isUserExist){
        return next(new ErrorClass("Email or mobile number already exists", 400, "Email or mobile number already exists"))  
    }

    // create new user instance
    const userInstance = new User({
        firstName,
        lastName,
        email,
        password : hashedPassword,
        recoveryEmail,
        DOB,
        mobileNumber,
        role
    })

    // generate token of user _id
    const token = jwt.sign(
        { _id: userInstance._id },
        process.env.CONFIRMATION_SECRET,
        { expiresIn: "1h" }
    );

    // confirmation Link
    const confirmationLink = `${req.protocol}://${req.headers.host}/user/confirm-email/${token}`

    // send email
    const isEmailSent = await sendEmailService({
        to: email,
        subject: "Welcome to job search app",
        textMessage: "Hello, welcome to our job search app",
        htmlMessage: `<a href="${confirmationLink}">Click here to confirm your email</a>`,
    });

    // check if email sent
    if (isEmailSent.rejected.length) {
        return next(new ErrorClass("Email not sent", 400, "Email not sent"));
    }

    // save user
    const newUser = await userInstance.save();

    // send response
    res.status(201).json({message: 'User created, please check your email to confirm your account'})
}

export const confirmEmail = async (req, res, next) => {
    
    // destruct token from req.params
    const { token } = req.params;
    
    // verify token to get _id
    const { _id } = jwt.verify(token, process.env.CONFIRMATION_SECRET)

    // find and update user isConfirmed
    const confirmedUser = await User.findOneAndUpdate(
      { _id, isConfirmed: false },
      { isConfirmed: true },
      { new: true }
    )

    // check if user founded and updated
    if (!confirmedUser) {
      return next(new ErrorClass("User not found", 400, "User not found"))
    }

    // response
    res.status(200).json({ message: "Email confirmed" });
}

export const signin = async (req, res, next)=>{

    // destruct email, mobileNumber and password from req.body
    const { email, mobileNumber, password } = req.body;

    // search for user email and mobileNumber
    const logUser = await User.findOne({ $or: [ { email }, { mobileNumber } ] })

    // check if user with email or mobileNumber not founded
    if (!logUser){
        return next(new ErrorClass("Invalid credentials", 400, "Email or mobile number incorrect"))

    // check if passowrd not matched
    } else if(! await bcrypt.compare(password, logUser.password)){
        return next(new ErrorClass("Invalid credentials", 400, "Password incorrect"))
    
    // generate token and login
    } else {
        // update user status
        const updateUserStatus = await User.findOneAndUpdate(
            { _id:logUser._id, isLogged: false, status: 'offline'},
            { status: 'online', isLogged: true },
            { new: true }
        )
        const logToken = jwt.sign({ userId: logUser._id }, process.env.LOGIN_SECRET)
        return res.json({message: 'User loged in successfully', logToken})
    }
}

export const get = async (req, res, next)=>{

    // get _id from req.authUser
    const { _id } = req.authUser
    
    // find user, no need to check if not found id as auth did that already 
    const foundedUser = await User.findById({ _id }).select("-password -_id -isConfirmed -createdAt -updatedAt -__v -isLogged")
    return res.status(200).json(foundedUser)
}

export const getProfile = async (req, res, next)=>{

    // get _id from req.params
    const _id = req.params.id
    
    // find user, no need to check if not found id as auth did that already 
    const foundedUser = await User.findById({ _id }).select("-password -_id -isConfirmed -createdAt -updatedAt -__v -isLogged")
    return res.status(200).json(foundedUser)
}

export const update = async (req, res, next)=>{

    // get user from auth
    const user = req.authUser

    // destruct data from req.body 
    const { email, mobileNumber , recoveryEmail , DOB , lastName , firstName } = req.body

    // check if the email or mobile number is already exists
    const isUserExist = await User.find({ $or: [ { email }, { mobileNumber } ] })
    if (isUserExist.length>1){
        return next(new ErrorClass("Email or mobile number already exists", 400, "Email or mobile number already exists"))  
    }

    // check if email changed or not
    if(email != user.email){

        // generate token of user _id
        const token = jwt.sign(
        { _id: user._id, email },
        process.env.CONFIRMATION_SECRET,
        { expiresIn: "1h" }
        );

        // confirmation Link
        const confirmationLink = `${req.protocol}://${req.headers.host}/user/confirm-email/${token}`

        // send email
        const isEmailSent = await sendEmailService({
            to: email,
            subject: "Welcome to job search app",
            textMessage: "Hello, welcome to our job search app",
            htmlMessage: `<a href="${confirmationLink}">Click here to confirm your new email</a>`,
        });

        // check if email sent
        if (isEmailSent.rejected.length) {
            return next(new ErrorClass("Email not sent", 400, "Email not sent"));
        }

        // set info and update
        user.mobileNumber = mobileNumber
        user.recoveryEmail = recoveryEmail
        user.DOB = DOB
        user.lastName = lastName
        user.firstName = firstName

        const updatedUser = await user.save()

        res.json({message: 'User updated successfully, please check your new email to confirm it'})
    } else {
        // set info and update
        user.mobileNumber = mobileNumber
        user.recoveryEmail = recoveryEmail
        user.DOB = DOB
        user.lastName = lastName
        user.firstName = firstName

        const updatedUser = await user.save()

        res.json({message: 'User updated successfully'})
    }
}

export const confirmNewEmail = async (req, res, next) => {
    
    // destruct token from req.params
    const { token } = req.params;
    
    // verify token to get _id
    const { _id, email } = jwt.verify(token, process.env.CONFIRMATION_SECRET)

    // find and update user isConfirmed
    const confirmedUser = await User.findOneAndUpdate(
      { _id },
      { email },
      { new: true }
    )

    // check if user founded and updated
    if (!confirmedUser) {
      return next(new ErrorClass("User not found", 400, "User not found"))
    }

    // response
    res.status(200).json({ message: "New email confirmed" });
}

export const remove = async (req, res, next)=>{

    // delete user
    const deletedUser = await User.deleteOne({_id:req.authUser._id})

    // get company of user and delete
    const deletedCompany = await Company.deleteOne({ companyHR:req.authUser._id })

    // get jobs of user and delete
    const deletedJobs = await Job.deleteMany({ addedBy:req.authUser._id })

    // get apps of user and delete
    const deletedApps = await Application.deleteMany({ userId:req.authUser._id })
    
    // check res
    if(deletedUser.deletedCount){
        res.status(200).json({message: 'User deleted'})
    } else{
        return next(new ErrorClass("User not deleted", 400, "User not deleted"))  
    }
}

export const updatePassword = async (req, res, next)=>{

    // get user from auth
    const user = req.authUser

    // destruct data from req.body 
    const { password } = req.body

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10)

    // set info and update
    user.password = hashedPassword

    const updatedUser = await user.save()

    res.json({message: 'User password updated successfully'})
}

export const generateOTP = async (req, res, next)=>{
    // destruct data from req.body
    const { email } = req.body

    // check if the email or mobile number is already exists
    const catchUser = await User.findOne({ email })
    if (!catchUser){
        return next(new ErrorClass("Email not found", 400, "Email not found"))  
    }

    // save otp
    const newOTP = await OTP.create({
        email,
        otp
    })

    // send otp email
    const isEmailSent = await sendEmailService({
        to: email,
        subject: "Job Search App - Forget Password",
        textMessage: "Hello, welcome to our job search app",
        htmlMessage: `<h1>Please confirm your OTP</h1><h2>OTP valid for 5 minutes only</h2><p>Here is your OTP code: ${otp}</p>`,
    });

    // check if email sent
    if (isEmailSent.rejected.length) {
        return next(new ErrorClass("Email not sent", 400, "Email not sent"));
    }

    // send response
    res.status(201).json({message: 'Please check your email for OTP'})
}

export const forgetPassword = async (req, res, next)=>{
    // destruct data from req.body
    const { otp, password } = req.body

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10)

    // check if the otp is valid
    const getDataOfOTP = await OTP.findOne({ otp })
    if (!getDataOfOTP){
        return next(new ErrorClass("OTP expired", 400, "OTP expired"))  
    }

    // get user of otp email
    const { email } = getDataOfOTP
    const getUserOfOTP = await User.findOne({ email })

    // update password of user
    getUserOfOTP.password = hashedPassword
    const updatedUser = await getUserOfOTP.save()

    // delete otp when done
    const deletedOTP = await OTP.deleteOne({otp})

    // send response
    res.status(201).json({message: 'Password updated'})
}

export const getAccounts = async (req, res, next)=>{

    // get recovery email from req.body
    const { recoveryEmail } = req.body
    
    // find users and return them
    const foundedUsers = await User.find({ recoveryEmail }).select("-password -_id -isConfirmed -createdAt -updatedAt -__v -isLogged")
    return res.status(200).json(foundedUsers)
}


