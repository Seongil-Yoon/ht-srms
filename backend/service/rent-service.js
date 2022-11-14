import {ObjectId} from 'mongodb';
import {User} from '../schemas/userSchema.js';
import {Item} from '../schemas/itemSchema.js';
import {Rent} from '../schemas/rentSchema.js';
import {Counter} from '../schemas/counterSchema.js';
import RentDTO from '../dto/rent-dto.js';

const RentService = {
    /**
     * @Params : RentDTO
     * @Return : doc
     */
    createRentByItem: async (req, rentDto) => {
        let result = false,
            counted,
            rentDoc,
            itemDoc;
        let newRentDto = RentDTO;
        try {
            newRentDto = rentDto;
            counted = await Counter.findOneAndUpdate(
                {name: 'counter'},
                {
                    $inc: {
                        rentNum: 1,
                    },
                }
            ).exec();
            newRentDto.rentNum = Number(counted.rentNum);
            rentDoc = await Rent.create(newRentDto);
            itemDoc = await Item.findOne({_id: req.params.itemObjectId}).exec();
            itemDoc.itemRentingAmount += 1;
            itemDoc.itemCanRentAmount =
                itemDoc.itemTotalAmount - itemDoc.itemRentingAmount;
            result = await Item.findOneAndUpdate(
                {_id: req.params.itemObjectId},
                {
                    $push: {
                        itemRentId: rentDoc._id,
                    },
                    itemRentingAmount: itemDoc.itemRentingAmount,
                    itemCanRentAmount: itemDoc.itemCanRentAmount,
                }
            ).exec();
            result = await User.findOneAndUpdate(
                {_id: req._id},
                {
                    $push: {
                        rentedItem: rentDoc._id,
                    },
                }
            ).exec();
            return result;
        } catch (error) {
            console.log(error);
            return result;
        }
    },
    selectRentByItem: async (itemObjectId, itemDto) => {
        let result = false;
        try {
            result = await Item.findOne({
                _id: ObjectId(itemObjectId),
            }).populate('itemRentId');

            return result;
        } catch (error) {
            console.log(error);
            return result;
        }
    },
    selectRentByUser: async (req, userDto) => {
        let result = false;
        try {
            result = await User.findOne({_id: ObjectId(req._id)}).populate(
                'rentedItem'
            );

            return result;
        } catch (error) {
            console.log(error);
            return result;
        }
    },
};
export default RentService;
