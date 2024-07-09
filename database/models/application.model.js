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


// to remove hours details from createdAt
applicationSchema.pre('save', function(next) {
    this.createdAt = new Date(this.createdAt.toISOString().split('T')[0]);
    next();
});


export default mongoose.models.Application || model("Application", applicationSchema)