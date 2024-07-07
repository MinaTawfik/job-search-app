import Job from '../../../database/models/job.model.js'
import Company from '../../../database/models/company.model.js'
import Application from '../../../database/models/application.model.js'
import { ErrorClass } from '../../utils/error-class.utils.js'


export const add = async (req, res, next)=>{

  // destruct data from req.auth
  const { _id } = req.authUser

  // destruct data from req.body
  const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body

  // create new job instance
  const jobInstance = new Job({
      jobTitle,  
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
      addedBy: _id
  })
  
  // save company
  const newJob = await jobInstance.save();

  // send response
  res.status(201).json({message: 'Job  added', newJob})
}

export const update = async (req, res, next)=>{

  // detruct job is from params
  const jobId = req.params.id

  // destruct data from req.body 
  const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body

  // check if user own job or not
  const job = await Job.findOne( { $and: [ { addedBy:req.authUser._id }, { _id:jobId } ] } ).select("-createdAt -updatedAt -__v -_id")
  if (!job){
      return next(new ErrorClass("User not own this job", 400, "User not own this job"))  
  }

  // set info and update
  job.jobTitle = jobTitle
  job.jobLocation = jobLocation
  job.workingTime = workingTime
  job.seniorityLevel = seniorityLevel
  job.jobDescription = jobDescription
  job.technicalSkills = technicalSkills
  job.softSkills = softSkills

  const updatedJob = await job.save()

  res.json({message: 'Job updated successfully', updatedJob})
}

export const remove = async (req, res, next)=>{

  // detruct job is from params
  const jobId = req.params.id

  // check if user own job or not
  const job = await Job.findOne( { $and: [ { addedBy:req.authUser._id }, { _id:jobId } ] } ).select("-createdAt -updatedAt -__v")
  if (!job){
      return next(new ErrorClass("User not own this job", 400, "User not own this job"))  
  }

  // delete job
  const deletedJob = await Job.deleteOne(job)
  
  // check res
  if(deletedJob.deletedCount){
      res.status(200).json({message: 'Job deleted'})
  } else{
      return next(new ErrorClass("Job not deleted", 400, "Job not deleted"))  
  }
}

export const getJobsAndCompanies = async (req, res, next)=>{
  
  // find company by HR id
  const companies = await Company.find().select("-createdAt -updatedAt -__v -_id").populate([{path:"companyHR", select: "-password -_id -isConfirmed -createdAt -updatedAt -__v -isLogged"}])

  // find jobs by HR id
  const jobs = await Job.find().select("-createdAt -updatedAt -__v -_id")
  
  return res.status(200).json({companies, jobs})
}

export const getjobsofCompany = async (req, res, next)=>{

  // detruct company id from params
  const companyName = req.params.companyname
  
  // find company by HR id
  const company = await Company.findOne({ companyName:companyName }).select("-createdAt -updatedAt -__v -_id").populate([{path:"companyHR", select: "-password -isConfirmed -createdAt -updatedAt -__v -isLogged"}])

  // check if there is job with this id
  if (!company){
    return next(new ErrorClass("Company not found", 400, "Company not found"))  
  }

  // find jobs by HR id
  const jobs = await Job.find({ addedBy:company.companyHR._id }).select("-createdAt -updatedAt -__v -_id")
  
  // check if no jobs for this company
  if (!jobs){
    return next(new ErrorClass("No jobs for this company", 400, "No jobs for this company"))  
  }
  
  return res.status(200).json({company, jobs})
}

export const filter = async (req, res, next)=>{

  // detruct filters from req.body
  const { jobTitle, jobLocation, workingTime, seniorityLevel, technicalSkills } = req.body

  // check if no jobs match the filter
  const jobs = await Job.find({ $or: [ { jobTitle }, { jobLocation }, { workingTime }, { seniorityLevel }, { technicalSkills } ] }).select("-createdAt -updatedAt -__v -_id")
  if (jobs.length == 0){
      return next(new ErrorClass("No jobs match your filter", 400, "No jobs match your filter"))  
  }
  
  return res.status(200).json(jobs)
}

export const apply = async (req, res, next)=>{

  // detruct filters from req.body
  const { jobId, userTechSkills, userSoftSkills, userResume } = req.body

  // check if user apllied before
  const app = await Application.findOne( { $and:[{ userId:req.authUser._id }, {jobId}] } )
  if (app){
      return next(new ErrorClass("You have applied to this job before", 400, "You have applied to this job before"))  
  }

  // create new app instance
  const appInstance = new Application({
    jobId,  
    userId: req.authUser._id,
    userTechSkills,
    userSoftSkills,
    userResume
  })

  // save app
  const newApp = await appInstance.save();
  
  return res.status(200).json({message: 'Application registered'})
}