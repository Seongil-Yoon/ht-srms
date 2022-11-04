import mongoose from 'mongoose';
import customMoment from '../utils/custom-moment.js';
import {Item} from './itemSchema.js';
import {User} from './userSchema.js';

const {Schema} = mongoose;
const rentSchema = new Schema(
    {
        rentNum: {
            type: Number,
            require: false
        },
        rentPurpose: {
            type: String,
            require: true,
            default: '대여 목적 없음',
        },
        rentAt: {
            type: Date,
            default: customMoment.asiaSeoulTimeNow(),
        },
        expectReturnAt: {
            type: Date,
            default: customMoment.asiaSeoulTimeNow() + 300000, //5분
        },
        realReturnAt: {
            type: Date,
            default: customMoment.asiaSeoulTimeNow(),
        },
        isExpire: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: customMoment.asiaSeoulTimeNow(),
        },
        updatedAt: {
            type: Date,
            default: customMoment.asiaSeoulTimeNow(),
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: User,
        },
        item: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: Item,
        },
    },
    {
        collection: 'rent',
    }
);
const Rent = mongoose.model('Rent', rentSchema);
export {Rent};
