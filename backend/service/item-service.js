import {Item} from '../schemas/itemSchema.js';
import paging from '../utils/paging-util.js';

const ItemService = {
    getItemList: async (
        pageNum,
        itemIsCanRent,
        itemCategoryLarge,
        itemCategorySmall,
        itemSearchSelect,
        itemOrberBySelect
    ) => {
        if (pageNum === undefined) throw Error('wrong query name');
        pageNum = Number(pageNum);
        if (isNaN(pageNum)) throw Error('wrong value type');
        const totalPost = await Item.countDocuments({});
        if (!totalPost) throw Error();
        /* ===== end of 파라미터 검증 ===== */

        let {startPage, endPage, hidePost, maxPost, totalPage, currentPage} =
            paging(pageNum, totalPost);
        const items = await Item.find({})
            .sort({createdAt: -1, itemNum: -1})
            .skip(hidePost)
            .limit(maxPost);

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
    },
};

export default ItemService;
