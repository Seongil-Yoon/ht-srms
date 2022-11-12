const itemModifyForm =
    document.querySelector('form#js-itemModifyForm') || document;
const dom = {
    itemCategoryLargeGroup: itemModifyForm.querySelector(
        '.item-category-large-group'
    ),
    itemCategoryLargeModifyAddInsert: itemModifyForm.querySelector(
        '#js-itemCategoryLargeModifyAddInsert'
    ),
    itemCategoryLargeModifyAddSelect: itemModifyForm.querySelector(
        '#js-itemCategoryLargeModifyAddSelect'
    ),
    itemCategorySmallGroup: itemModifyForm.querySelector(
        '.item-category-small-group'
    ),
    itemCategorySmallModifyAddInsert: itemModifyForm.querySelector(
        '#js-itemCategorySmallModifyAddInsert'
    ),
    itemCategoryLargeModify: itemModifyForm.querySelector(
        '#js-itemCategoryLargeModify'
    ),
    itemCategorySmallModify: itemModifyForm.querySelector(
        '#js-itemCategorySmallModify'
    ),
    itemCategorySmallModifyAddSelect: itemModifyForm.querySelector(
        '#js-itemCategorySmallModifyAddSelect'
    ),
    itemNameModify: itemModifyForm.querySelector('#js-itemNameModify'),
    itemIsCanRentModify: document.getElementsByName('itemIsCanRentModify'),
    itemIsNeedReturnModify: document.getElementsByName(
        'itemIsNeedReturnModify'
    ),
    itemIdModify: itemModifyForm.querySelector('#js-itemIdModify'),
    itemTotalAmountModify: itemModifyForm.querySelector(
        '#js-itemTotalAmountModify'
    ),
};
export {dom};
