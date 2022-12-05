const RentDTO = {
    _id: undefined,
    rentNum: undefined,
    renter: {
        _id: undefined,
        userId: undefined,
        userName: undefined,
        userDept: undefined,
        userPosition: undefined,
    },
    rentedItem: {
        _id: undefined,
        itemNum: undefined,
        itemId: undefined,
        itemName: undefined,
        itemCategory: {
            large: undefined,
            small: undefined,
        },
        itemIsCanRent: undefined,
        itemIsNeedReturn: undefined,
        itemCanRentAmount: undefined,
        itemRentingAmount: undefined,
        itemTotalAmount: undefined,
    },
    rentPurpose: undefined,
    rentAt: undefined,
    expectReturnAt: undefined,
    realReturnAt: undefined,
    isExpire: undefined,
    isReturned: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    isDelete: undefined,
};

export default RentDTO;
