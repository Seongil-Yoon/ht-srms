import mongoose from 'mongoose';
import customMoment from '../utils/custom-moment.js';
import {Item} from './itemSchema.js';
import {User} from './userSchema.js';

const {Schema} = mongoose;
const rentSchema = new Schema(
    {
        rentNum: {
            type: Number,
            require: true,
        },
        renter: {
            type: Object,
            require: true,
            default: {
                _id: undefined,
                userId: undefined,
                userName: undefined,
                userDept: undefined,
                userPosition: undefined,
            },
        },
        rentedItem: {
            type: Object,
            require: true,
            default: {
                _id: undefined,
                itemId: undefined,
                itemName: undefined,
                itemCategory: {
                    large: undefined,
                    small: undefined,
                },
            },
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
        isReturned: {
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
    },
    {
        collection: 'rent',
    }
);
const Rent = mongoose.model('Rent', rentSchema);
export {Rent};
