const ItemDTO = {
    itemNum: undefined,
    itemId: undefined,
    itemWriter: undefined,
    itemRentId: [],
    itemCategory: {large: undefined, small: undefined},
    itemName: undefined,
    itemIsCanRent: undefined,
    itemIsNeedReturn: undefined,
    itemCanRentAmount: undefined,
    itemRentingAmount: undefined,
    itemTotalAmount: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    isDelete: undefined,
};

/*
class ItemDTO {
    _itemNum;
    _itemId;
    _itemWriter;
    _renter;
    _itemCategory;
    _itemName;
    _itemIsCanRent;
    _itemIsNeedReturn;
    _itemCanRentAmount;
    _itemRentingAmount;
    _itemTotalAmount;
    _createdAt;
    _updatedAt;
    _isDelete;

    constructor(data) {
        this._itemNum = data.itemNum;
        this._itemId = data.itemId;
        this._itemWriter = data.itemWriter;
        this._renter = data.renter;
        this._itemCategory = data.itemCategory;
        this._itemName = data.itemName;
        this._itemIsCanRent = data.itemIsCanRent;
        this._itemIsNeedReturn = data.itemIsNeedReturn;
        this._itemCanRentAmount = data.itemCanRentAmount;
        this._itemRentingAmount = data.itemRentingAmount;
        this._itemTotalAmount = data.itemTotalAmount;
        this._createdAt = data.createdAt;
        this._updatedAt = data.updatedAt;
        this._isDelete = data.isDelete;
    }

    get itemNum() {
        return this._itemNum;
    }
    set itemNum(value) {
        this._itemNum = value;
    }
    get itemId() {
        return this._itemId;
    }
    set itemId(value) {
        this._itemId = value;
    }
    get itemWriter() {
        return this._itemWriter;
    }
    set itemWriter(value) {
        this._itemWriter = value;
    }
    get renter() {
        return this._renter;
    }
    set renter(value) {
        this._renter = value;
    }
    get itemCategory() {
        return this._itemCategory;
    }
    set itemCategory(value) {
        this._itemCategory = value;
    }
    get itemName() {
        return this._itemName;
    }
    set itemName(value) {
        this._itemName = value;
    }
    get itemIsCanRent() {
        return this._itemIsCanRent;
    }
    set itemIsCanRent(value) {
        this._itemIsCanRent = value;
    }
    get itemIsNeedReturn() {
        return this._itemIsNeedReturn;
    }
    set itemIsNeedReturn(value) {
        this._itemIsNeedReturn = value;
    }
    get itemCanRentAmount() {
        return this._itemCanRentAmount;
    }
    set itemCanRentAmount(value) {
        this._itemCanRentAmount = value;
    }
    get itemRentingAmount() {
        return this._itemRentingAmount;
    }
    set itemRentingAmount(value) {
        this._itemRentingAmount = value;
    }
    get itemTotalAmount() {
        return this._itemTotalAmount;
    }
    set itemTotalAmount(value) {
        this._itemTotalAmount = value;
    }
    get createdAt() {
        return this._createdAt;
    }
    set createdAt(value) {
        this._createdAt = value;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    set updatedAt(value) {
        this._updatedAt = value;
    }
    get isDelete() {
        return this._isDelete;
    }
    set isDelete(value) {
        this._isDelete = value;
    }
}
*/
export default ItemDTO;
