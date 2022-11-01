import {convertCookieToObject} from './cookie-util.js';
import isEmptyObj from './isEmptyObj.js';

function blockGoToInit(req, res, next) {
    const tokenInCookie = convertCookieToObject(req.headers.cookie);
    console.log(tokenInCookie);
    if (tokenInCookie !== undefined) {
        if (tokenInCookie.accessToken) {
            //엑세스토큰있으면 물품관리페이지.
            return res.redirect('/item-manage');
        } else {
            //엑세스토큰 없으면 다음 로그인페이지 라우터
            next();
        }
    }else{
        //토큰 없으면 다음 로그인페이지 라우터
        next();
    }
}

export default blockGoToInit;
