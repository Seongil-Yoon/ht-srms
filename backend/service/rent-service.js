import {ObjectId} from 'mongodb';
import {User} from '../schemas/userSchema.js';
import {Item} from '../schemas/itemSchema.js';
import {Rent} from '../schemas/rentSchema.js';
import {Counter} from '../schemas/counterSchema.js';
import RentDTO from '../dto/rent-dto.js';
import UserDTO from '../dto/user-dto.js';
import paging from '../utils/paging-util.js';

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
            newRentDto.rentedItem.itemRentingAmount += 1;
            newRentDto.rentedItem.itemCanRentAmount =
                newRentDto.rentedItem.itemTotalAmount -
                newRentDto.rentedItem.itemRentingAmount;

            rentDoc = await Rent.create(newRentDto);
            itemDoc = await Item.findOne({_id: req.params.itemObjectId}).exec();
            itemDoc.result = await Item.findOneAndUpdate(
                {_id: req.params.itemObjectId},
                {
                    $push: {
                        itemRentId: rentDoc._id,
                    },
                    itemRentingAmount: newRentDto.rentedItem.itemRentingAmount,
                    itemCanRentAmount: newRentDto.rentedItem.itemCanRentAmount,
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
    updateRentedItemByItem: async (itemDto) => {
        let result = false;
        try {
            result = await Rent.updateMany(
                {'rentedItem._id': ObjectId(itemDto._id)},
                {
                    rentedItem: {
                        itemNum: itemDto.itemNum,
                        itemId: itemDto.itemId,
                        itemName: itemDto.itemName,
                        itemCategory: {
                            large: itemDto.itemCategory.large,
                            small: itemDto.itemCategory.small,
                        },
                        itemIsCanRent: itemDto.itemIsCanRent,
                        itemIsNeedReturn: itemDto.itemIsNeedReturn,
                        itemCanRentAmount: itemDto.itemCanRentAmount,
                        itemRentingAmount: itemDto.itemRentingAmount,
                        itemTotalAmount: itemDto.itemTotalAmount,
                    },
                }
            );
            return result;
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * 물품이 삭제될때 Rent스키마 Update
     */
    setDeleteRentedItemByItem: async (itemObjectId) => {
        let result = false;
        try {
            result = await Rent.updateMany(
                {'rentedItem._id': ObjectId(itemObjectId)},
                {
                    isDelete: true,
                }
            );
            return result;
        } catch (error) {
            console.log(error);
        }
    },
    selectRentListByUser: async (userObjectId, pageNum) => {
        let userDoc = undefined,
            rents = undefined;
        let totalPost = 0;
        try {
            if (pageNum === undefined) throw Error('wrong query name');
            pageNum = Number(pageNum);
            if (isNaN(pageNum)) throw Error('wrong value type');
            /* ===== end of pageNum 파라미터 검증 ===== */

            userDoc = await User.findOne({_id: userObjectId}).populate({
                path: 'rentedItem',
                match: {
                    $and: [{isReturned: false}, {isDelete: false}],
                },
                options: {sort: {expectReturnAt: 1}},
            });

            //개선 필요(총 대여건)
            if (userDoc.rentedItem !== undefined) {
                rents = userDoc.rentedItem.filter((e) => {
                    return e.isReturned === false && e.isDelete === false;
                });
            }

            totalPost = rents.length;
            if (!totalPost) throw Error('찾는 자료 없음');

            let {
                startPage,
                endPage,
                hidePost,
                maxPost,
                totalPage,
                currentPage,
            } = paging(pageNum, totalPost);

            rents = rents.splice(hidePost, maxPost);
            return {
                pageInfo: {
                    startPage,
                    endPage,
                    maxPost,
                    hidePost,
                    totalPage,
                    currentPage,
                },
                rents,
            };
        } catch (error) {
            throw Error(error);
        }
    },
    deleteRenterByUser: async (req, userDto) => {
        let result = false;
        try {
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * 1건의 물품에 인증사용자가 대여했는지 체크. 이미 대여 했다면 예외던짐
     * @params : req, itemDoc
     * @throw : Error('dup renter')
     */
    renterDupliChk: (req, itemDoc) => {
        if (itemDoc.itemRentId !== undefined) {
            itemDoc.itemRentId.filter((e) => {
                if (e.renter._id.toString() === req._id)
                    throw Error('dup renter');
            });
        }
    },
};
export default RentService;
