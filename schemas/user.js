import mongoose from "mongoose";

const Schema = mongoose;
const userSchema = new Schema({
    empId: {
        type: String,
        required: true,
        unique: true,
    },
    empName: {
        type: String,
        required: true,
        unique: false,
    },
    empPassword: {
        type: String,
        required: true,
    },
    empEmail: {
        type: String,
        required: true,
    },
    deptName: {
        type: String,
        require: true
    },
    jobName: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    collection: "user",

});
const User = mongoose.model('User', userSchema);
module.exports = {
    User
};