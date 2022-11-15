import mongoose from 'mongoose';
import {ObjectId} from 'mongodb';
import {Item} from '../schemas/itemSchema.js';
import {User} from '../schemas/userSchema.js';
import {ItemCategory} from '../schemas/itemCategorySchema.js';
import paging from '../utils/paging-util.js';
import itemfilterAndOrderby from './item-search-service.js';

const ItemService = {
    getItemList: async (
        pageNum,
        itemIsCanRent,
        itemCategoryLarge,
        itemCategorySmall,
        itemSearchSelect,
        itemSearchInput,
        itemSortSelect,
        itemOrberBySelect
    ) => {
        try {
            if (pageNum === undefined) throw Error('wrong query name');
            pageNum = Number(pageNum);
            if (isNaN(pageNum)) throw Error('wrong value type');
            /* ===== end of pageNum 파라미터 검증 ===== */
            const totalPost = await Item.countDocuments({
                isDelete: false,
            }).exec();
            if (!totalPost) throw Error();

            let {
                startPage,
                endPage,
                hidePost,
                maxPost,
                totalPage,
                currentPage,
            } = paging(pageNum, totalPost);
            if (itemCategoryLarge === '대분류') itemCategoryLarge = '';
            if (itemCategorySmall === '소분류') itemCategorySmall = '';

            if (itemSearchSelect === 'itemWriter') {
                let findUserByItem = await User.findOne({
                    userName: itemSearchInput,
                }).exec();
                if (findUserByItem === null) throw Error('not found user');
                itemSearchInput = ObjectId(findUserByItem._id);
            }

            let items = await itemfilterAndOrderby({
                pageNum,
                itemIsCanRent,
                itemCategoryLarge,
                itemCategorySmall,
                itemSearchSelect,
                itemSearchInput,
                itemSortSelect,
                itemOrberBySelect,
                hidePost,
                maxPost,
            });

            return {
                pageInfo: {
                    startPage,
                    endPage,
                    maxPost,
                    hidePost,
                    totalPage,
                    currentPage,
                },
                items,
            };
        } catch (error) {
            throw Error(error);
        }
    },
    /**
     * @params : itemCategory : {large, small}
     * @return : result of itemCategory document
     */
    updateItemCategory: (itemCategory) => {
        return new Promise((resolve, reject) => {
            ItemCategory.findOne({
                'itemCategory.large': itemCategory.large,
            })
                .exec()
                .then((e) => {
                    if (e != null) {
                        ItemCategory.findOne({
                            'itemCategory.small': itemCategory.small,
                        })
                            .exec()
                            .then((e) => {
                                if (e == null) {
                                    ItemCategory.findOneAndUpdate(
                                        {
                                            'itemCategory.large':
                                                itemCategory.large,
                                        },
                                        {
                                            $push: {
                                                'itemCategory.small':
                                                    itemCategory.small,
                                            },
                                        }
                                    )
                                        .exec()
                                        .then((e) => resolve(e));
                                } else {
                                    resolve(e);
                                }
                            });
                    } else {
                        ItemCategory.create({
                            itemCategory: {
                                large: itemCategory.large,
                                small: [itemCategory.small],
                            },
                        }).then((e) => resolve(e));
                    }
                });
        });
    },
};

export default ItemService;
