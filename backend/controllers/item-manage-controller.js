import express from 'express';
import mongoose from 'mongoose';
import {ObjectId} from 'mongodb';
import {Item} from '../schemas/itemSchema.js';
import ItemDTO from '../dto/item-dto.js';
import {Counter} from '../schemas/counterSchema.js';
import {ItemCategory} from '../schemas/itemCategorySchema.js';
import ItemService from '../service/item-service.js';
import ExceptionAdvice from '../utils/exception-advice.js';
import paging from '../utils/paging-util.js';
import customUtill from '../utils/custom-utill.js';
import {types, matchType} from '../utils/type-checker.js';
import {ItemIds} from '../schemas/itemIdsSchema.js';

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
    valiItemId: async (req, res) => {
        try {
            const {itemId} = req.body;
            let result = await ItemService.valiItemId({itemId});

            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send({
                ok: false,
                message: '',
            });
        }
    },
    valiFastItemId: async (req, res) => {
        try {
            let itemIds = await ItemIds.findOneAndUpdate(
                {name: 'item-ids'},
                {
                    $push: {
                        itemIdList: 1,
                    },
                }
            ).exec();
        } catch (error) {
            console.log(error);
            res.status(500).send({
                ok: false,
                message: '',
            });
        }
    },
    insertItem: async (req, res) => {
        try {
            let result, counted;
            const itemList = req.body;

            //컬렉션 없을때
            let collectionExists = await mongoose.connection.db
                .listCollections({
                    name: 'itemcategory',
                })
                .toArray();
            if (collectionExists.length <= 0) {
                await ItemCategory.create({
                    itemCategory: {
                        large: '대분류',
                        small: ['소분류'],
                    },
                }).catch((e) => {
                    res.status(400).send({
                        ok: false,
                        message: '물품 항목을 확인해주세요',
                    });
                });
            }

            /**
             * 비동기 작업 순차처리(for)
             */
            let duplicateList = [];
            let unDuplicateList = [];
            const itemListValiForEach = async (itemList) => {
                let result;
                await customUtill.asyncForEach(itemList, async (element) => {
                    try {
                        result = await ItemService.valiItemId({
                            itemId: element.itemId,
                        });

                        if (!result.ok) {
                            duplicateList.push(element);
                        } else {
                            unDuplicateList.push(element);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                });
                return duplicateList;
            };

            const itemListForEach = async (itemList) => {
                await customUtill.asyncForEach(itemList, async (element) => {
                    let insertResult = undefined;
                    let itemDoc = undefined;
                    let itemCategoryDoc = undefined;
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
                    itemDto.itemIsCanRent = JSON.parse(
                        matchType(
                            element.itemIsCanRent,
                            types.STRING
                        ).toLowerCase()
                    );
                    itemDto.itemIsNeedReturn = JSON.parse(
                        matchType(
                            element.itemIsNeedReturn,
                            types.STRING
                        ).toLowerCase()
                    );
                    itemDto.itemTotalAmount = Number(element.itemTotalAmount);
                    itemDto.createdAt = Date.now();
                    console.log(itemDto);
                    itemDoc = await Item.create(itemDto);
                    itemCategoryDoc = await ItemService.updateItemCategory(
                        itemDoc.itemCategory
                    );
                    return itemCategoryDoc;
                });
            };

            let idlist = await itemListValiForEach(itemList);
            if (idlist.length > 0) {
                res.status(200).json({
                    ok: false,
                    message: '이미 등록된 물품입니다',
                    duplicateList: idlist,
                    unDuplicateList: unDuplicateList,
                });
            } else {
                itemListForEach(itemList)
                    .then((e) => {
                        res.status(200).json({
                            ok: true,
                            message: '물품 등록 결과',
                            result: e,
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(400).json({
                            ok: false,
                            message: '잘못된 입력값입니다',
                        });
                    });
            }
        } catch (error) {
            console.log(error);
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

            let thisItem = await Item.findById(ObjectId(newItemDTO._id)).exec();
            let dupChk = await ItemService.valiItemId({
                itemId: newItemDTO.itemId,
            });
            if (dupChk.ok === false && dupChk.itemId === thisItem.itemId) {
                res.status(200).json({
                    ok: false,
                    message: '현재 편집중인 물품코드입니다',
                    duplicateedId: dupChk.itemId,
                });
            } else {
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
