const convertCookieToObject = (cookies) => {
    const cookieItems = cookies.split(';');

    const obj = {};
    cookieItems.forEach((item) => {
        // '='으로 분리
        const elem = item.split('=');
        // 키 가져오기
        const key = elem[0].trim();
        // 값 가져오기
        const val = decodeURIComponent(elem[1]);
        // 저장
        obj[key] = val;
    });
    return obj;
};

export {convertCookieToObject};
