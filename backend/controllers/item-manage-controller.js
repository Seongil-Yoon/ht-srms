import express from 'express';
import ItemService from '../service/item-service.js';
import {Item} from '../schemas/itemSchema.js';
import ItemDTO from '../dto/item-dto.js';
import {Counter} from '../schemas/counterSchema.js';
import {ItemCategory} from '../schemas/itemCategorySchema.js';
import {ObjectId} from 'mongodb';

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
    getInsertItemPage: (req, res) => {
        res.render('item/item-insert', {
            userInfo: {
                _id: req._id,
                userId: req.userId,
                userRole: req.userRole,
                userName: req.userName,
            },
        });
    },
    getItemList: (req, res) => {},
    getItem: (req, res) => {},
    insertItem: async (req, res) => {
        try {
            let result, counted;
            let itemDto = undefined;
            const itemList = req.body;
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
                itemDto.itemIsCanRent = element.itemIsCanRent;
                itemDto.itemIsNeedReturn = element.itemIsNeedReturn;
                itemDto.itemCanRentAmount = Number(element.itemTotalAmount);
                itemDto.itemTotalAmount = Number(element.itemTotalAmount);

                await Item.create(itemDto);
                result = await ItemCategory.findOne({
                    'itemCategory.large': itemDto.itemCategory.large,
                });
                if (result) {
                    try {
                        result = await ItemCategory.findOne({
                            'itemCategory.small': itemDto.itemCategory.small,
                        });
                        if (!result) {
                            result = await ItemCategory.findOneAndUpdate(
                                {
                                    'itemCategory.large': itemDto.itemCategory.large,
                                },
                                {
                                    $push: {
                                        'itemCategory.small':
                                            itemDto.itemCategory.small,
                                    },
                                }
                            );
                            console.log(result);
                        }
                    } catch (error) {
                        console.log(error);
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
                    }
                }
            }); //end of for-each
            res.status(200).send({
                ok: true,
                message: '',
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
