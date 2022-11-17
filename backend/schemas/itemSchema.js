import mongoose from 'mongoose';
import {Rent} from './rentSchema.js';
import {User} from './userSchema.js';

const {Schema} = mongoose;
const itemSchema = new Schema(
    {
        itemNum: {
            type: Number,
            require: true,
            unique: true,
        },
        itemId: {
            type: String,
            require: false,
            unique: true,
        },
        itemWriter: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        itemRentId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                require: false,
                ref: 'Rent',
            },
        ],
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
            default: 0,
        },
        itemTotalAmount: {
            type: Number,
            require: false,
            default: 1,
        },
        createdAt: {
            type: Date,
        },
        updatedAt: {
            type: Date,
            default: Date.now(),
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
