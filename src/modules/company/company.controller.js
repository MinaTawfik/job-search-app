import Company from '../../../database/models/company.model.js'
import { ErrorClass } from '../../utils/error-class.utils.js'
import Job from '../../../database/models/job.model.js'
import Application from '../../../database/models/application.model.js'
import ExcelJS from 'exceljs'


export const add = async (req, res, next)=>{

    // destruct data from req.auth
    const { _id } = req.authUser

    // check if user own company or not
    const company = await Company.findOne({companyHR:_id}).select("-createdAt -updatedAt -__v")
    if (company){
        return next(new ErrorClass("User own company already", 400, "User own company already"))  
    }

    // destruct data from req.body
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body

    // check if company name is already exists
    const isCompanyExist = await Company.findOne({ companyName })
    if (isCompanyExist){
        return next(new ErrorClass("Company already exists", 400, "Company already exists"))  
    }

    // create new company instance
    const companyInstance = new Company({
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        companyHR: _id
    })
    
    // save company
    const newCompany = await companyInstance.save();

    // send response
    res.status(201).json({message: 'Company added', newCompany})
}

export const update = async (req, res, next)=>{

    // get user from auth
    const { _id } = req.authUser

    // destruct data from req.body 
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body

    // check if user own company or not
    const company = await Company.findOne({companyHR:_id}).select("-createdAt -updatedAt -__v")
    if (!company){
        return next(new ErrorClass("User not own any companies", 400, "User not own any companies"))  
    }

    // set info and update
    company.companyName = companyName
    company.description = description
    company.industry = industry
    company.address = address
    company.numberOfEmployees = numberOfEmployees
    company.companyEmail = companyEmail

    const updatedCompany = await company.save()

    res.json({message: 'Company updated successfully', updatedCompany})
}

export const remove = async (req, res, next)=>{
    
    // get user from auth
    const { _id } = req.authUser

    // check if user own company or not
    const company = await Company.findOne({companyHR:_id}).select("-createdAt -updatedAt -__v")
    if (!company){
        return next(new ErrorClass("User not own any companies", 400, "User not own any companies"))  
    }

    // delete company
    const deletedUser = await Company.deleteOne(company)
    
    // check res
    if(deletedUser.deletedCount){
        res.status(200).json({message: 'Company deleted'})
    } else{
        return next(new ErrorClass("Company not deleted", 400, "Company not deleted"))  
    }
}

export const get = async (req, res, next)=>{

    // get _id from req.params
    const _id = req.params.id

    // check company id
    const company = await Company.findById({ _id })
    if (!company){
        return next(new ErrorClass("Company not found", 400, "Company not found"))  
    }
    
    // find jobs by HR id
    const jobs = await Job.find({ addedBy:company.companyHR }).select("-createdAt -updatedAt -__v -_id")
    if (!jobs){
        return next(new ErrorClass("Jobs not found", 400, "Jobs not found"))  
    }

    // find user, no need to check if not found id as auth did that already 
    const foundedCompany = await Company.findById({ _id }).select("-createdAt -updatedAt -__v -_id").populate([{path:"companyHR", select: "-password -_id -isConfirmed -createdAt -updatedAt -__v -isLogged"}])
    return res.status(200).json({foundedCompany, jobs})
}

export const search = async (req, res, next)=>{

    // get _id from req.params
    const companyName = req.params.companyname
    
    // find user, no need to check if not found id as auth did that already 
    const foundedCompany = await Company.findOne({ companyName }).select("-createdAt -updatedAt -__v -_id")

    if (!foundedCompany){
        return next(new ErrorClass("Company not found", 400, "Company not found"))  
    }

    return res.status(200).json(foundedCompany)
}

export const getAllApp = async (req, res, next)=>{
    
    // get all jobs for user 
    const jobs = await Job.find({ addedBy:req.authUser._id }).select("-createdAt -updatedAt -__v")
    
    // create array to store application for each job
    let apps =[]

    // store apps for each job
    for (let job in jobs){
        const aplications = await Application.find({ jobId:jobs[job]._id }).select("-createdAt -updatedAt -__v -_id").populate([{path:"userId", select: "-password -_id -isConfirmed -createdAt -updatedAt -__v -isLogged"}])
        if(aplications.length!=0){
            apps.push(aplications)
        }
    }

    return res.status(200).json(apps)
}

export const getExcel = async (req, res, next)=>{

    // get data
    const _id = req.params.companyid
    const {createdAt} = req.body

    // build date as DB
    const date = `${createdAt}T00:00:00.000+00:00`


    // get company
    const company = await Company.findById({ _id })
    if (!company){
        return next(new ErrorClass("Company not found", 400, "Company not found"))  
    }
    
    // find jobs by HR id
    const jobs = await Job.find({ addedBy:company.companyHR }).select("-createdAt -updatedAt -__v")
    if (!jobs){
        return next(new ErrorClass("Jobs not found", 400, "Jobs not found"))  
    }

    // create array of jobs ids
    let jobsIds = []

    // store jobs ids to array
    for (let job in jobs){
        jobsIds.push(jobs[job]._id)
    }

    // create array of jobs applications
    let apps = []

    // find apps and store in array
    for (let id in jobsIds){
        const foundedApplications = await Application.find({ $and: [ { jobId:jobsIds[id] }, { createdAt:date } ] }).select("-__v -_id -userResume -createdAt -updatedAt")
        .populate([
            {path:"jobId", select: "jobTitle -_id"},
            {path:"userId", select: "username -_id"}
        ])
        if(foundedApplications.length!=0){
            apps.push(foundedApplications)
        }
    }

    // build excel sheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    worksheet.columns = [
      { header: 'Job Name', key: 'jobId', width: 30 },
      { header: 'User Name', key: 'userId', width: 20 },
      { header: 'User Tech Skills', key: 'userTechSkills', width: 30 },
      { header: 'User Soft Skills', key: 'userSoftSkills', width: 30 },
      // Add other headers as needed
    ];

    for(let app in apps){
        apps[app].forEach((application) => {
            worksheet.addRow(application);
          });
    }
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=applications.xlsx`
    );
  
    await workbook.xlsx.write(res);
}