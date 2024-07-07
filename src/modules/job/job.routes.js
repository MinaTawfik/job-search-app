import {Router} from 'express'
const router = Router()
import * as jobController from './job.controller.js'
import { errorHandler } from "../../middlewares/error-handling.middleware.js"
import { auth } from '../../middlewares/authentication.middleware.js'
import { roles, systemRoles } from "../../utils/system-roles.utils.js"
import { authorizationMiddleware } from '../../middlewares/authorization.middleware.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import { addSchema, updateSchema, getjobsofCompanySchema, filterSchema, applySchema } from './job.schema.js'

router.post('/add',
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)), 
    validationMiddleware(addSchema),
    errorHandler(jobController.add)
)

router.put('/update/:id',
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
    validationMiddleware(updateSchema),
    errorHandler(jobController.update)
)

router.delete('/delete/:id',
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
    validationMiddleware(updateSchema),
    errorHandler(jobController.remove)
)

router.get('/getjobsandcompanies',
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(roles.HR_USER)), 
    errorHandler(jobController.getJobsAndCompanies)
)

router.get('/getjobs/:companyname',
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(roles.HR_USER)), 
    validationMiddleware(getjobsofCompanySchema),
    errorHandler(jobController.getjobsofCompany)
)

router.get('/filter',
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(roles.HR_USER)),
    validationMiddleware(filterSchema),
    errorHandler(jobController.filter)
)

router.post('/apply',
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.USER)),
    validationMiddleware(applySchema), 
    errorHandler(jobController.apply)
)


export default router