import mongoose from 'mongoose';
import customMoment from '../utils/custom-moment.js';
import {Rent} from './rentSchema.js';
import {User} from './userSchema.js';

const {Schema} = mongoose;

/* 물품별 검색시 드랍다운 메뉴 빠른 조회 */
const itemCategorySchema = new Schema(
    {
        itemCategory: {
            type: Object,
            require: true,
            large: {
                type: String,
                unique: true,
            },
            small: {
                type: Array,
            },
            default: {
                large: '',
                small: [''],
            },
        },
    },
    {
        collection: 'itemcategory',
    }
);
const ItemCategory = mongoose.model('ItemCategory', itemCategorySchema);
export {ItemCategory};
