import mongoose from 'mongoose';

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
            type: Map,
            require: false,
        },
        deptName: {
            type: String,
            require: false,
        },
        jobName: {
            type: String,
            require: false,
        },
        refreshToken: {
            type: String,
            require: false,
        },
    },
    {
        timestamps: true,
        collection: 'user',
    }
);
const User = mongoose.model('User', userSchema);
export {User};
/**
 * ES6 문법
 * export 할 경우에는 import { 함수명 } from * 으로 사용
 * export default 하실 경우에는 import 함수명 from * 으로 사용
 */
