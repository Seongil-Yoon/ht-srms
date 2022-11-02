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
                read: true,
                rent: true,
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
    },
    {
        collection: 'user',
    }
);
const User = mongoose.model('User', userSchema);
export {User};
