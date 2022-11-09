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
            const itemCategory = await ItemCategory.find({});
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
            itemOrberBySelect,
        } = req.query;
        console.log(itemIsCanRent);
        try {
            const result = await ItemService.getItemList(
                pageNum,
                itemIsCanRent,
                itemCategoryLarge,
                itemCategorySmall,
                itemSearchSelect,
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
                    );
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

                    insertResult = await Item.create(itemDto);
                    result = await ItemCategory.findOne({
                        'itemCategory.large': itemDto.itemCategory.large,
                    });
                    //물품 분류 스키마
                    if (result) {
                        try {
                            result = await ItemCategory.findOne({
                                'itemCategory.small':
                                    itemDto.itemCategory.small,
                            });
                            if (!result) {
                                result = await ItemCategory.findOneAndUpdate(
                                    {
                                        'itemCategory.large':
                                            itemDto.itemCategory.large,
                                    },
                                    {
                                        $push: {
                                            'itemCategory.small':
                                                itemDto.itemCategory.small,
                                        },
                                    }
                                );
                            }
                        } catch (error) {
                            console.log(error);
                            res.status(500).send({
                                ok: false,
                                message: '물품 항목을 확인해주세요',
                            });
                        }
                    } else {
                        try {
                            result = await ItemCategory.create({
                                itemCategory: {
                                    large: itemDto.itemCategory.large,
                                    small: [itemDto.itemCategory.small],
                                },
                            });
                        } catch (error) {
                            console.log(error);
                            res.status(500).send({
                                ok: false,
                                message: '물품 항목을 확인해주세요',
                            });
                        }
                    } //end of 물품 분류 스키마
                }); //end of for-each
                return insertResult;
            };

            itemListForEach().then((e) => {
                console.log(e); // 해결필요
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
    updateItem: (req, res) => {},
    deleteItem: (req, res) => {},
    getHistoryListByItem: (req, res) => {},
    getRenterListByItem: (req, res) => {
        const itemId = req.params.itemId;
        res.status(200).send({
            ok: true,
            message: `${itemId}대여자 이력`,
        });
    },
    exportByAllItemList: (req, res) => {},
};

export default ItemManageController;
