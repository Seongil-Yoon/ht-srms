import {Item} from '../schemas/itemSchema.js';
import {User} from '../schemas/userSchema.js';

const itemfilterAndOrderby = async ({
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
}) => {
    let items;
    try {
        if (itemIsCanRent === 'any') {
            if (itemSearchSelect !== 'itemWriter') {
                items = await Item.find({})
                    .where({
                        isDelete: false,
                    })
                    .where({
                        'itemCategory.large': {
                            $regex: new RegExp(`.*${itemCategoryLarge}.*`),
                        },
                    })
                    .where({
                        'itemCategory.small': {
                            $regex: new RegExp(`.*${itemCategorySmall}.*`),
                        },
                    })
                    .where({
                        [itemSearchSelect || 'itemName']: {
                            $regex: new RegExp(`.*${itemSearchInput}.*`),
                        },
                    })
                    .skip(hidePost)
                    .limit(maxPost)
                    .sort({
                        [itemSortSelect || 'itemNum']: itemOrberBySelect,
                    })
                    .exec();
            } else {
                items = await Item.find({})
                    .where({
                        isDelete: false,
                    })
                    .where({
                        'itemCategory.large': {
                            $regex: new RegExp(`.*${itemCategoryLarge}.*`),
                        },
                    })
                    .where({
                        'itemCategory.small': {
                            $regex: new RegExp(`.*${itemCategorySmall}.*`),
                        },
                    })
                    .where({
                        [itemSearchSelect || 'itemName']: itemSearchInput,
                    })
                    .skip(hidePost)
                    .limit(maxPost)
                    .sort({
                        [itemSortSelect || 'itemNum']: itemOrberBySelect,
                    })
                    .exec();
            }
        } else {
            if (itemSearchSelect !== 'itemWriter') {
                items = await Item.find({})
                    .where({
                        isDelete: false,
                    })
                    .where({
                        itemIsCanRent: itemIsCanRent,
                    })
                    .where({
                        'itemCategory.large': {
                            $regex: new RegExp(`.*${itemCategoryLarge}.*`),
                        },
                    })
                    .where({
                        'itemCategory.small': {
                            $regex: new RegExp(`.*${itemCategorySmall}.*`),
                        },
                    })
                    .where({
                        [itemSearchSelect || 'itemName']: {
                            $regex: new RegExp(`.*${itemSearchInput}.*`),
                        },
                    })
                    .skip(hidePost)
                    .limit(maxPost)
                    .sort({
                        [itemSortSelect || 'itemNum']: itemOrberBySelect,
                    })
                    .exec();
            } else {
                items = await Item.find({})
                    .where({
                        isDelete: false,
                    })
                    .where({
                        itemIsCanRent: itemIsCanRent,
                    })
                    .where({
                        'itemCategory.large': {
                            $regex: new RegExp(`.*${itemCategoryLarge}.*`),
                        },
                    })
                    .where({
                        'itemCategory.small': {
                            $regex: new RegExp(`.*${itemCategorySmall}.*`),
                        },
                    })
                    .where({
                        [itemSearchSelect || 'itemName']: itemSearchInput,
                    })
                    .skip(hidePost)
                    .limit(maxPost)
                    .sort({
                        [itemSortSelect || 'itemNum']: itemOrberBySelect,
                    })
                    .exec();
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        return items;
    }
};

export default itemfilterAndOrderby;
