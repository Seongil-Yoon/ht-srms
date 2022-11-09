import mongoose from 'mongoose';

const {Schema} = mongoose;
const counterSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
        },
        userNum: Number,
        itemNum: Number,
        rentNum: Number,
    },
    {collection: 'counter'}
);
const Counter = mongoose.model('Counter', counterSchema);
export {Counter};
