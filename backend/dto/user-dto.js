class UserDTO {
    _userNum;
    _userId;
    _rentedItem;
    _writedItem;
    _userName;
    _userPassword;
    _userEmail;
    _userRole;
    _userDept;
    _userPosition;
    _createdAt;
    _updatedAt;
    _refreshToken;
    _isDelete;

    constructor(data) {
        this._userNum = data.userNum;
        this._userId = data.userId;
        this._rentedItem = data.rentedItem;
        this._writedItem = data.writedItem;
        this._userName = data.userName;
        this._userPassword = data.userPassword;
        this._userEmail = data.userEmail;
        this._userRole = data.userRole;
        this._userDept = data.userDept;
        this._userPosition = data.userPosition;
        this._createdAt = data.createdAt;
        this._updatedAt = data.updatedAt;
        this._refreshToken = data.refreshToken;
        this._isDelete = data.isDelete;
    }

    get userNum() {
        return this._userNum;
    }
    set userNum(value) {
        this._userNum = value;
    }
    get userId() {
        return this._userId;
    }
    set userId(value) {
        this._userId = value;
    }
    get rentedItem() {
        return this._rentedItem;
    }
    set rentedItem(value) {
        this._rentedItem = value;
    }
    get writedItem() {
        return this._writedItem;
    }
    set writedItem(value) {
        this._writedItem = value;
    }
    get userName() {
        return this._userName;
    }
    set userName(value) {
        this._userName = value;
    }
    get userPassword() {
        return this._userPassword;
    }
    set userPassword(value) {
        this._userPassword = value;
    }
    get userEmail() {
        return this._userEmail;
    }
    set userEmail(value) {
        this._userEmail = value;
    }
    get userRole() {
        return this._userRole;
    }
    set userRole(value) {
        this._userRole = value;
    }
    get userDept() {
        return this._userDept;
    }
    set userDept(value) {
        this._userDept = value;
    }
    get userPosition() {
        return this._userPosition;
    }
    set userPosition(value) {
        this._userPosition = value;
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
    get refreshToken() {
        return this._refreshToken;
    }
    set refreshToken(value) {
        this._refreshToken = value;
    }
    get isDelete() {
        return this._isDelete;
    }
    set isDelete(value) {
        this._isDelete = value;
    }
}

export default UserDTO;
