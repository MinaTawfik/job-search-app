import mongoose, { model } from "mongoose";

const {Schema} = mongoose;

const otpSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    otp:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
    },
}, {timestamps: true})

export default mongoose.models.OTP || model("OTP", otpSchema)