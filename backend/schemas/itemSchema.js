import mongoose from 'mongoose';
import customMoment from '../utils/custom-moment.js';
import {User} from './userSchema.js';

const {Schema} = mongoose;
const itemSchema = new Schema(
    {
        itemNum: {
            type: Number,
            require: false
        },
        itemId: {
            type: String,
            require: false,
            unique: true,
        },
        itemCategory: {
            type: Object,
            require: true,
            default: {
                large: '대분류',
                small: '소분류',
            },
        },
        itemName: {
            type: String,
            require: true,
        },
        itemIsCanRent: {
            type: Boolean,
            require: true,
            default: false,
        },
        itemIsNeedReturn: {
            type: Boolean,
            require: true,
            default: false,
        },
        itemCanRentAmount: {
            type: Number,
            default: 1,
        },
        itemRentingAmount: {
            type: Number,
            default: 1,
        },
        itemTotalAmount: {
            type: Number,
            require: false,
            default: 1,
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
            required: true,
            ref: User,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
    },
    {
        collection: 'item',
    }
);
const Item = mongoose.model('Item', itemSchema);
export {Item};
