import mongoose from 'mongoose';

const {Schema} = mongoose;
const itemIdsSchema = new Schema(
    {
        itemIdList: [
            {
                type: String,
            },
        ],
        updatedAt: {
            type: Date,
            default: Date.now(),
        },
        name: {
            type: String,
            unique: true,
        },
    },
    {collection: 'item-ids'}
);
/**
 * @deprecated
 */
const ItemIds = mongoose.model('item-ids', itemIdsSchema);
export {ItemIds};
