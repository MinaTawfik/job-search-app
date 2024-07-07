import {Router} from 'express'
const router = Router()
import * as companyController from './company.controller.js'
import { errorHandler } from "../../middlewares/error-handling.middleware.js"
import { auth } from '../../middlewares/authentication.middleware.js'
import { roles, systemRoles } from "../../utils/system-roles.utils.js"
import { authorizationMiddleware } from '../../middlewares/authorization.middleware.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import { addSchema, getSchema, searchSchema } from './company.schema.js'


router.post(
    '/add',
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
    validationMiddleware(addSchema),
    errorHandler(companyController.add)
)

router.put(
    '/update',
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
    validationMiddleware(addSchema),
    errorHandler(companyController.update)
)

router.delete(
    '/delete',
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)), 
    errorHandler(companyController.remove)
)

router.get(
    '/get/:id',
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
    validationMiddleware(getSchema),
    errorHandler(companyController.get)
)

router.get(
    '/search/:companyname',
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(roles.HR_USER)),
    validationMiddleware(searchSchema),
    errorHandler(companyController.search)
)

router.get(
    '/getallapps',
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)), 
    errorHandler(companyController.getAllApp)
)


export default router