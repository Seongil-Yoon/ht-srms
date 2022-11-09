import express from 'express';
import {ObjectId} from 'mongodb';
import {Item} from '../schemas/itemSchema.js';
import ItemDTO from '../dto/item-dto.js';
import {Counter} from '../schemas/counterSchema.js';
import {ItemCategory} from '../schemas/itemCategorySchema.js';
import ItemService from '../service/item-service.js';
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
        let {pageNum} = req.query;
        console.log(pageNum);
        try {
            if (pageNum === undefined) throw Error('wrong query name');
            pageNum = Number(pageNum);
            if (isNaN(pageNum)) throw Error('wrong value type');
            const totalPost = await Item.countDocuments({});
            if (!totalPost) throw Error();
            let {
                startPage,
                endPage,
                hidePost,
                maxPost,
                totalPage,
                currentPage,
            } = paging(pageNum, totalPost);
            const items = await Item.find({})
                .sort({createdAt: -1, itemNum: -1})
                .skip(hidePost)
                .limit(maxPost);
            res.status(200).json({
                pageInfo: {
                    startPage,
                    endPage,
                    maxPost,
                    totalPage,
                    currentPage,
                },
                items,
            });
        } catch (error) {
            console.log(error);
            if (error.message === 'wrong query name') {
                res.status(400).json({
                    ok: false,
                    message: error.message,
                    advice : 'query name : pageNum',
                    detail: {
                        key: Object.keys(req.query),
                        keyAndValue: req.query,
                    },
                    items: [],
                });
            } else if (error.message === 'wrong value type') {
                res.status(400).json({
                    ok: false,
                    message: error.message,
                    advice : 'value type : Number',
                    detail: {
                        key: Object.keys(req.query),
                        keyAndValue: req.query,
                    },
                    items: [],
                });
            } else {
                res.status(404).json({
                    ok: false,
                    message: error.message,
                    items: [],
                });
            }
        }
    },
    getItem: (req, res) => {},
    insertItem: async (req, res) => {
        try {
            let result, counted;
            let itemDto = undefined;
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
