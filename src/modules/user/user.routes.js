import {Router} from 'express'
const router = Router()
import * as userController from './user.controller.js'
import { errorHandler } from "../../middlewares/error-handling.middleware.js"
import { auth } from '../../middlewares/authentication.middleware.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import { signupSchema, confirmEmailSchema, signinSchema, getSchema, updatePasswordSchema, generateOTPSchema, forgetPasswordSchema } from './user.schema.js'

router.post(
    '/signup',
    validationMiddleware(signupSchema),
    errorHandler(userController.signup)
)
router.patch(
    '/confirm-email/:token',
    validationMiddleware(confirmEmailSchema),
    errorHandler(userController.confirmEmail)
)
router.patch(
    '/confirm-new-email/:token',
    validationMiddleware(confirmEmailSchema),
    errorHandler(userController.confirmNewEmail)
)
router.put(
    '/signin', 
    validationMiddleware(signinSchema),
    errorHandler(userController.signin)
)
router.put(
    '/update',
    errorHandler(auth()),
    errorHandler(userController.update)
)
router.get(
    '/get', 
    errorHandler(auth()),
    errorHandler(userController.get)
)

router.get(
    '/getprofile/:id', 
    errorHandler(auth()),
    validationMiddleware(getSchema),
    errorHandler(userController.getProfile)
)

router.delete(
    '/delete', 
    errorHandler(auth()),
    errorHandler(userController.remove)
)

router.patch(
    '/updatepassword',
    errorHandler(auth()),
    validationMiddleware(updatePasswordSchema),
    errorHandler(userController.updatePassword)
)

router.post(
    '/generateotp',
    validationMiddleware(generateOTPSchema),
    errorHandler(userController.generateOTP)
)

router.patch(
    '/forgetpassword',
    validationMiddleware(forgetPasswordSchema),
    errorHandler(userController.forgetPassword)
)

router.get(
    '/getaccounts', 
    errorHandler(auth()),
    errorHandler(userController.getAccounts)
)


export default router