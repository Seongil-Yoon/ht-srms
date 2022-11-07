const userDto = {
    userId: undefined,
    userName: undefined,
    userPassword: undefined,
    userEmail: undefined,
    userDept: undefined,
    userPosition: undefined,
};
/* 싱글톤 및 빌더 패턴*/
/* let instance = null;
class userDto {
    _userId;
    _userName;
    _userPassword;
    _userEmail;
    _userDept;
    _userPosition;

    constructor(builder) {
        if (instance) return instance;
        this._userId = builder.getUserId();
        this._userName = builder.getUserName();
        this._userPassword = builder.getUserPassword();
        this._userEmail = builder.getUserEmail();
        this._userDept = builder.getUserDept();
        this._userPosition = builder.getUserPosition();
        instance = this;
    }

    get getUserId() {
        return this._userId;
    }
    get getUserName() {
        return this._userName;
    }
    get getUserPassword() {
        return this._userPassword;
    }
    get getUserEmail() {
        return this._userEmail;
    }
    get getUserDept() {
        return this._userDept;
    }
    get getUserPosition() {
        return this._userPosition;
    }

    set setUserId(value) {
        this._userId = value;
    }
    set setUserName(value) {
        this._userName = value;
    }
    set setUserPassword(value) {
        this._userPassword = value;
    }
    set setUserEmail(value) {
        this._userEmail = value;
    }
    set setUserDept(value) {
        this._userDept = value;
    }
    set setUserPosition(value) {
        this._userPosition = value;
    }

    static Builder = class {
        _userId;
        _userName;
        _userPassword;
        _userEmail;
        _userDept;
        _userPosition;

        get getUserId() {
            return this._userId;
        }
        get getUserName() {
            return this._userName;
        }
        get getUserPassword() {
            return this._userPassword;
        }
        get getUserEmail() {
            return this._userEmail;
        }
        get getUserDept() {
            return this._userDept;
        }
        get getUserPosition() {
            return this._userPosition;
        }

        set setUserId(value) {
            this._userId = value;
        }
        set setUserName(value) {
            this._userName = value;
        }
        set setUserPassword(value) {
            this._userPassword = value;
        }
        set setUserEmail(value) {
            this._userEmail = value;
        }
        set setUserDept(value) {
            this._userDept = value;
        }
        set setUserPosition(value) {
            this._userPosition = value;
        }

        build() {
            return new userDto(this);
        }
    };
}
*/
export {userDto};
