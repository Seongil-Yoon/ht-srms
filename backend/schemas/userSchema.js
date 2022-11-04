import mongoose from 'mongoose';
import customMoment from '../utils/custom-moment.js';

const {Schema} = mongoose;
const userSchema = new Schema(
    {
        userNum: {
            type: Number,
            require: false,
        },
        userId: {
            type: String,
            require: true,
            unique: true,
        },
        userName: {
            type: String,
            require: true,
        },
        userPassword: {
            type: String,
            require: true,
        },
        userEmail: {
            type: String,
            require: false,
        },
        userRole: {
            type: Object,
            require: true,
            default: {
                rent: true,
                read: false,
                write: false,
                edit: false,
                admin: false,
            },
        },
        userDept: {
            type: String,
            require: true,
            default: 'etc',
        },
        userPosition: {
            type: String,
            require: true,
            default: 'etc',
        },
        refreshToken: {
            type: String,
            require: false,
        },
        createdAt: {
            type: Date,
            default: customMoment.asiaSeoulTimeNow(),
        },
        updatedAt: {
            type: Date,
            default: customMoment.asiaSeoulTimeNow(),
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
    },
    {
        collection: 'user',
    }
);
const User = mongoose.model('User', userSchema);
export {User};
