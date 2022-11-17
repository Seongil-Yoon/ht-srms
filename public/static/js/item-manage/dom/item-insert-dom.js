const itemInsertMain = document.querySelector('.item-insert-main') || document;
const dom = {
    itemIdInput: itemInsertMain.querySelector('#js-itemId'),
    itemIdCheckAlarm: itemInsertMain.querySelector('#js-itemIdCheckAlarm'),
    itemInsertFormBtn: itemInsertMain.querySelector('#js-itemInsertFormBtn'),
    itemFormResetBtn: itemInsertMain.querySelector('#js-itemFormResetBtn'),
    itemListResetBtn: itemInsertMain.querySelector('#js-itemListResetBtn'),
    itemListSave: itemInsertMain.querySelector('#js-itemListSave'),
    getXlsxForm: itemInsertMain.querySelector('#js-getXlsxForm'),
    itemInsertCancel: itemInsertMain.querySelector('#js-itemInsertCancel'),
    itemInsertSubmit: itemInsertMain.querySelector('#js-itemInsertSubmit'),
    table_16_btn: itemInsertMain.querySelector('#table_16_btn'),
    itemCategoryLargeGroup: itemInsertMain.querySelector(
        '.item-category-large-group'
    ),
    itemCategoryLargeAddInsert: itemInsertMain.querySelector(
        '#js-itemCategoryLargeAddInsert'
    ),
    itemCategoryLargeAddSelect: itemInsertMain.querySelector(
        '#js-itemCategoryLargeAddSelect'
    ),
    itemCategorySmallGroup: itemInsertMain.querySelector(
        '.item-category-small-group'
    ),
    itemCategorySmallAddInsert: itemInsertMain.querySelector(
        '#js-itemCategorySmallAddInsert'
    ),
    itemCategorySmallAddSelect: itemInsertMain.querySelector(
        '#js-itemCategorySmallAddSelect'
    ),
};

export {dom};
