import mongoose, { model } from "mongoose";

const {Schema} = mongoose;

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    username:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    recoveryEmail:{
        type: String,
        required: true,
    },
    DOB:{
        type: Date,
        required: true,
    },
    mobileNumber:{
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        enum: ['User', 'Company_HR'],
        default: 'User',
        required: true
    },
    status:{
        type: String,
        enum: ['online', 'offline'],
        default: 'offline',
    },
    isConfirmed:{
        type: String,
        enum: [true, false],
        default: false,
    },
    isLogged:{
        type: String,
        enum: [true, false],
        default: false
    }
}, {timestamps: true})

userSchema.pre('save', async function(next) {
    this.username = `${this.firstName}${this.lastName}`;
    next();
});


export default mongoose.models.User || model("User", userSchema)