import mongoose from 'mongoose';
import customMoment from '../utils/custom-moment.js';

const {Schema} = mongoose;
const userSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        userName: {
            type: String,
            required: true,
        },
        userPassword: {
            type: String,
            required: true,
        },
        userEmail: {
            type: String,
            required: false,
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
            require: false,
            default: 'etc',
        },
        userPosition: {
            type: String,
            require: false,
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
