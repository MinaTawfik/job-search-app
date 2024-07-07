import mongoose, { model } from "mongoose";

const {Schema} = mongoose;

const jobSchema = new Schema({
    jobTitle:{
        type: String,
        required: true
    },
    jobLocation:{
        type: String,
        enum: ['onsite', 'remotely', 'hybrid'],
    },
    workingTime:{
        type: String,
        enum: ['part-time', 'full-time'],
    },
    seniorityLevel:{
        type: String,
        enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'],
    },
    jobDescription:{
        type: String,
        required: true
    },
    technicalSkills:{
        type: [String]
    },
    softSkills:{
        type: [String]
    },
    addedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})


export default mongoose.models.Car || model("Job", jobSchema)