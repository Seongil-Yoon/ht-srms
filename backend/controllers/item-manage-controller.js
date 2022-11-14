import express from 'express';
import {ObjectId} from 'mongodb';
import {Item} from '../schemas/itemSchema.js';
import ItemDTO from '../dto/item-dto.js';
import {Counter} from '../schemas/counterSchema.js';
import {ItemCategory} from '../schemas/itemCategorySchema.js';
import ItemService from '../service/item-service.js';
import ExceptionAdvice from '../utils/exception-advice.js';
import paging from '../utils/paging-util.js';

const router = express();

const ItemManageController = {
    getItemPage: (req, res) => {
        res.render('item/item-manage', {
            userInfo: {
                _id: req._id,
                userId: req.userId,
                userRole: req.userRole,
                userName: req.userName,
            },
        });
    },
    getInsertItemPage: async (req, res) => {
        try {
            res.render('item/item-insert', {
                userInfo: {
                    _id: req._id,
                    userId: req.userId,
                    userRole: req.userRole,
                    userName: req.userName,
                },
            });
        } catch (error) {
            console.log(error);
            res.status(404).send({
                ok: false,
                message: '',
            });
        }
    },
    getAllItemCategory: async (req, res) => {
        try {
            const itemCategory = await ItemCategory.find({}).exec();
            res.json(itemCategory);
        } catch (error) {
            console.log(error);
            res.status(404).send({
                ok: false,
                message: '',
            });
        }
    },
    getItemList: async (req, res) => {
        let {
            pageNum,
            itemIsCanRent,
            itemCategoryLarge,
            itemCategorySmall,
            itemSearchSelect,
            itemSearchInput,
            itemSortSelect,
            itemOrberBySelect,
        } = req.query;
        try {
            const result = await ItemService.getItemList(
                pageNum,
                itemIsCanRent,
                itemCategoryLarge,
                itemCategorySmall,
                itemSearchSelect,
                itemSearchInput,
                itemSortSelect,
                itemOrberBySelect
            );
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            ExceptionAdvice.item(req, res, error);
        }
    },
    getItem: (req, res) => {},
    insertItem: async (req, res) => {
        try {
            let result, counted;
            const itemList = req.body;
            const itemListForEach = async () => {
                let insertResult = undefined;

                itemList.forEach(async (element) => {
                    let itemDto = ItemDTO;
                    counted = await Counter.findOneAndUpdate(
                        {name: 'counter'},
                        {
                            $inc: {
                                itemNum: 1,
                            },
                        }
                    ).exec();
                    itemDto.itemNum = Number(counted.itemNum);
                    itemDto.itemId = element.itemId;
                    itemDto.itemWriter = ObjectId(req._id);
                    itemDto.itemCategory = {
                        large: element.itemCategoryLarge,
                        small: element.itemCategorySmall,
                    };
                    itemDto.itemName = element.itemName;
                    itemDto.itemIsCanRent = element.itemIsCanRent.toLowerCase();
                    itemDto.itemIsNeedReturn =
                        element.itemIsNeedReturn.toLowerCase();
                    itemDto.itemCanRentAmount = Number(element.itemTotalAmount);
                    itemDto.itemTotalAmount = Number(element.itemTotalAmount);
                    itemDto.createdAt = Date.now();

                    insertResult = await Item.create(itemDto);
                    insertResult = await ItemService.updateItemCategory(
                        insertResult.itemCategory
                    );
                }); //end of for-each
                return await insertResult;
            };

            await itemListForEach().then((e) => {
                console.log('itemListForEach:', e); // 해결필요
                res.status(200).send({
                    ok: true,
                    message: '물품 등록 결과',
                    result: e,
                });
            });
        } catch (error) {
            console.log(error);
            res.status(400).send({
                ok: false,
                message: '물품 항목을 확인해주세요',
            });
        }
    },
    updateItem: async (req, res) => {
        try {
            let result = undefined;
            let newItemDTO = ItemDTO;
            newItemDTO = req.body;
            if (newItemDTO.itemTotalAmount < newItemDTO.itemRentingAmount)
                throw Error('wrong amount');
            newItemDTO.itemCanRentAmount =
                newItemDTO.itemTotalAmount - newItemDTO.itemRentingAmount;
            newItemDTO.updatedAt = new Date().toISOString();
            result = await Item.findOneAndUpdate(
                {_id: newItemDTO._id, isDelete: false},
                newItemDTO
            ).exec();
            result = await ItemService.updateItemCategory(
                newItemDTO.itemCategory
            );
            if (result) {
                res.status(200).json({
                    ok: true,
                    itemNum: newItemDTO.itemNum,
                    message: `물품 편집 성공`,
                });
            } else {
                throw Error('죄송합니다 편집이 실패했습니다');
            }
        } catch (error) {
            console.log(error);
            if (error.message === 'wrong amount') {
                res.status(400).json({
                    ok: false,
                    message: `총 수량은 대여 중 수량보다 작을 수 없습니다`,
                });
            }
            res.status(500).json({
                ok: false,
                message: `${error.message}`,
            });
        }
    },
    deleteItem: async (req, res) => {
        try {
            const itemObjectId = req.params.itemObjectId;
            let result = await Item.findOneAndUpdate(
                {_id: itemObjectId},
                {isDelete: true}
            ).exec();
            if (result) {
                res.status(200).json({
                    ok: true,
                    itemNum: result.itemNum,
                    message: `물품 삭제 성공`,
                });
            } else {
                throw Error('죄송합니다 삭제가 실패했습니다');
            }
        } catch (error) {
            console.log(error);
            res.status(404).json({
                ok: false,
                message: `${error.message}`,
            });
        }
    },
    getHistoryListByItem: (req, res) => {},
    getRenterListByItem: (req, res) => {
        const itemObjectId = req.params.itemObjectId;
        res.status(200).send({
            ok: true,
            message: `${itemId}대여자 이력`,
        });
    },
    exportByAllItemList: (req, res) => {},
};

export default ItemManageController;
