const userDto = {
    userId: undefined,
    userName: undefined,
    userPassword: undefined,
    userEmail: undefined,
    userDept: undefined,
    userPosition: undefined,
};
/* 싱글톤패턴
let instance = null;
class userDto {
    constructor(userId, userName) {
        if (instance) return instance;
        this.userId = userId;
        this.userName = userName;
        this.userPassword = undefined;
        this.userEmail = undefined;
        this.userDept = undefined;
        this.userPosition = undefined;
        instance = this;
    }
}
*/
export {userDto};
