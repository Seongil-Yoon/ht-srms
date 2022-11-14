import mongoose from 'mongoose';
import {Item} from './itemSchema.js';
import {User} from './userSchema.js';

const {Schema} = mongoose;
const rentSchema = new Schema(
    {
        rentNum: {
            type: Number,
            require: true,
            unique: true,
        },
        renter: {
            type: Object,
            require: true,
            default: {
                _id: {type: Object},
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
                _id: {type: Object},
                itemNum: undefined,
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
            default: Date.now(),
        },
        expectReturnAt: {
            type: Date,
            default: Date.now() + 300000, //5분
        },
        realReturnAt: {
            type: Date,
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
        },
        updatedAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        collection: 'rent',
    }
);
const Rent = mongoose.model('Rent', rentSchema);
export {Rent};
