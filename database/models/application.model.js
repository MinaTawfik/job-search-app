import mongoose, { model } from "mongoose";

const {Schema} = mongoose;

const applicationSchema = new Schema({
    jobId:{
        type: Schema.Types.ObjectId,
        ref: "Job"
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    userTechSkills:{
        type: [String]
    },
    userSoftSkills:{
        type: [String]
    },
    userResume:{
        type: String
    }
}, {timestamps: true})


export default mongoose.models.Application || model("Application", applicationSchema)