const rentInsertForm =
    document.querySelector('form#js-itemRentForm') || document;

const dom = {
    itemRentFormResetBtn: rentInsertForm.querySelector(
        '#js-itemRentFormResetBtn'
    ),
    itemCategoryLargeRent: rentInsertForm.querySelector(
        '#js-itemCategoryLargeRent'
    ),
    itemCategorySmallRent: rentInsertForm.querySelector(
        '#js-itemCategorySmallRent'
    ),
    itemNameRent: rentInsertForm.querySelector('#js-itemNameRent'),
    itemIdRent: rentInsertForm.querySelector('#js-itemIdRent'),
    rentPurpose: rentInsertForm.querySelector('#js-rentPurpose'),
    expectReturnWarn: rentInsertForm.querySelector('#js-expectReturnWarn'),
    rentAt: rentInsertForm.querySelector('#js-rentAt'),
    expectReturnAt: rentInsertForm.querySelector('#js-expectReturnAt'),
    itemNeedNotReturnAlarm: rentInsertForm.querySelector(
        '#js-itemNeedNotReturnAlarm'
    ),
    itemRentCancel: rentInsertForm.querySelector('#js-itemRentCancel'),
    itemRentSubmit: rentInsertForm.querySelector('#js-itemRentSubmit'),
};

export {dom};
