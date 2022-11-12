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
            const totalPost = await Item.countDocuments({});
            if (!totalPost) throw Error();
            /* ===== end of pageNum 파라미터 검증 ===== */

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
    updateItemCategory: async (itemCategory) => {
        try {
            let result = await ItemCategory.findOne({
                'itemCategory.large': itemCategory.large,
            }).exec();
            if (result) {
                try {
                    result = await ItemCategory.findOne({
                        'itemCategory.small': itemCategory.small,
                    }).exec();
                    if (!result) {
                        result = await ItemCategory.findOneAndUpdate(
                            {
                                'itemCategory.large': itemCategory.large,
                            },
                            {
                                $push: {
                                    'itemCategory.small': itemCategory.small,
                                },
                            }
                        ).exec();
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
                            large: itemCategory.large,
                            small: [itemCategory.small],
                        },
                    });
                } catch (error) {
                    console.log(error);
                    res.status(500).send({
                        ok: false,
                        message: '물품 항목을 확인해주세요',
                    });
                }
            }
            return result;
        } catch (error) {
            console.log(error);
        }
    },
};

export default ItemService;
