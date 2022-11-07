/** 정규화 */
// 이용자
var user = {
    _id: '', // 이용자 다큐먼트ID
    usernum: 1, // 이용자 등록순번
    userid: '', // 사번
    username: '', // 사원 이름
    userpassword: '', // 비밀번호
    useremail: '', // 이메일
    userrole: '', // 권한
    userdept: '', // 부서
    userposition: '', // 직책
    createdat: '2022-11-04 14:31:52', // 생성일
    updatedat: '2022-11-04 14:31:52', // 수정일
    isdelete: '', // 탈퇴여부
    refreshtoken: '', // 리프레쉬토큰
};
// 물품
var item = {
    _id: '', // 물품 다큐먼트ID
    user: {
        _id,
    }, // 이용자 다큐먼트ID
    itemnum: 1, // 물품 등록순번
    itemid: '', // 물품 코드(제품 코드)
    itemcategory: '', // 분류
    itemname: '', // 물품 이름
    itemiscanrent: '', // 대여 가능 여부
    itemisneedreturn: '', // 반납 필요 여부
    itemcanrentamount: 1, // 대여 가능 수량
    itemrentingamount: 1, // 대여 중 수량
    itemtotalamount: 1, // 총 수량
    createdat: '2022-11-04 14:29:12', // 생성일
    updatedat: '2022-11-04 14:29:12', // 수정일
    isdelete: '', // 삭제여부
};

// 대여
var rent = {
    _id: '', // 대여 다큐먼트ID
    user: {
        _id,
    }, // 이용자 다큐먼트ID
    item: {
        _id,
    }, // 물품 다큐먼트ID
    rentnum: 1, // 대여 등록순번
    rentpurpose: '', // 대여 목적
    rentat: '2022-11-04 14:32:02', // 대여일
    expectreturnat: '2022-11-04 14:32:02', // 예상 반납일
    realreturnat: '2022-11-04 14:32:02', // 실제 반납일
    isexpire: '', // 반납일 초과여부
    createdat: '2022-11-04 14:32:02', // 생성일
    updatedat: '2022-11-04 14:32:02', // 수정일
};

/** 반정규화 v1 */
// 이용자 embeded in 물품
var item = {
    _id: '', // 물품 다큐먼트ID
    userOfWrite: {
        _id: '', // 이용자 다큐먼트ID
        usernum: 1, // 이용자 등록순번
        userid: '', // 사번
        username: '', // 사원 이름
        userpassword: '', // 비밀번호
        useremail: '', // 이메일
        userrole: '', // 권한
        userdept: '', // 부서
        userposition: '', // 직책
        createdat: '2022-11-04 14:31:52', // 생성일
        updatedat: '2022-11-04 14:31:52', // 수정일
        isdelete: '', // 탈퇴여부
        refreshtoken: '', // 리프레쉬토큰
    },
    itemnum: 1, // 물품 등록순번
    itemid: '', // 물품 코드(제품 코드)
    itemcategory: '', // 분류
    itemname: '', // 물품 이름
    itemiscanrent: '', // 대여 가능 여부
    itemisneedreturn: '', // 반납 필요 여부
    itemcanrentamount: 1, // 대여 가능 수량
    itemrentingamount: 1, // 대여 중 수량
    itemtotalamount: 1, // 총 수량
    createdat: '2022-11-04 14:29:12', // 생성일
    updatedat: '2022-11-04 14:29:12', // 수정일
    isdelete: '', // 삭제여부
};

// 이용자 및 물품 embeded in 대여
var rent = {
    _id: '', // 대여 다큐먼트ID
    userOfRent: {
        _id: '', // 이용자 다큐먼트ID
        usernum: 1, // 이용자 등록순번
        userid: '', // 사번
        username: '', // 사원 이름
        userpassword: '', // 비밀번호
        useremail: '', // 이메일
        userrole: '', // 권한
        userdept: '', // 부서
        userposition: '', // 직책
        createdat: '2022-11-04 14:31:52', // 생성일
        updatedat: '2022-11-04 14:31:52', // 수정일
        isdelete: '', // 탈퇴여부
        refreshtoken: '', // 리프레쉬토큰
    },
    item: {
        _id, // 물품 다큐먼트ID
    },
    rentnum: 1, // 대여 등록순번
    rentpurpose: '', // 대여 목적
    rentat: '2022-11-04 14:32:02', // 대여일
    expectreturnat: '2022-11-04 14:32:02', // 예상 반납일
    realreturnat: '2022-11-04 14:32:02', // 실제 반납일
    isexpire: '', // 반납일 초과여부
    createdat: '2022-11-04 14:32:02', // 생성일
    updatedat: '2022-11-04 14:32:02', // 수정일
};

/* 반정규화 v2 [확정]*/
var user = {
    _id: '', // 이용자 다큐먼트ID
    writedItem_id: ['물품ID'],
    rentedItem_id: ['렌탈ID'],
    usernum: 1, // 이용자 등록순번
    userid: '', // 사번
    username: '', // 사원 이름
    userpassword: '', // 비밀번호
    useremail: '', // 이메일
    userrole: '', // 권한
    userdept: '', // 부서
    userposition: '', // 직책
    createdat: '2022-11-04 14:31:52', // 생성일
    updatedat: '2022-11-04 14:31:52', // 수정일
    isdelete: '', // 탈퇴여부
    refreshtoken: '', // 리프레쉬토큰
};
var rent = {
    _id: '', // 대여 다큐먼트ID
    renter: {
        //사원스키마 반정규화
        _id: '',
        userid: '', // 사번
        username: '', // 사원 이름
        dept: '', // 부서
        userposition: '', // 직책
    },
    item_id: {
        //물품스키마 반정규화
        _id: '',
        itemid: '', // 물품 코드(제품 코드)
        itemcategory: '', // 분류
        itemname: '', // 물품 이름
    },
    rentnum: 1, // 대여 등록순번
    rentpurpose: '', // 대여 목적
    rentat: '2022-11-04 14:32:02', // 대여일
    expectreturnat: '2022-11-04 14:32:02', // 예상 반납일
    realreturnat: '2022-11-04 14:32:02', // 실제 반납일
    isExpire: '', // 반납일 초과여부
    createdat: '2022-11-04 14:32:02', // 생성일
    updatedat: '2022-11-04 14:32:02', // 수정일
};

var item = {
    _id: '', // 물품 다큐먼트ID
    itemWriter: '유저ID',
    rent_id: ['렌탈ID'],
    itemnum: 1, // 물품 등록순번
    itemid: '', // 물품 코드(제품 코드)
    itemcategory: '', // 분류
    itemname: '', // 물품 이름
    itemiscanrent: '', // 대여 가능 여부
    itemisneedreturn: '', // 반납 필요 여부
    itemcanrentamount: 1, // 대여 가능 수량
    itemrentingamount: 1, // 대여 중 수량
    itemtotalamount: 1, // 총 수량
    createdat: '2022-11-04 14:29:12', // 생성일
    updatedat: '2022-11-04 14:29:12', // 수정일
    isdelete: '', // 삭제여부
};
