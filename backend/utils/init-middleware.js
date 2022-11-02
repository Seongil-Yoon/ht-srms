import customJwt from './auth-jwt.js';
import {convertCookieToObject} from './cookie-util.js';
import isEmptyObj from './isEmptyObj.js';

function blockGoToInit(req, res, next) {
    const tokenInCookie = convertCookieToObject(req.headers.cookie);
    try {
        if (tokenInCookie !== undefined) {
            if (tokenInCookie.accessToken) {
                const result = customJwt.verify(tokenInCookie.accessToken);
                if (result.ok) {
                    console.log("customJwt.verify : ", customJwt.verify);
                    //엑세스토큰있으며 검증되면 물품관리페이지.
                    return res.redirect('/item-manage');
                } else {
                    //엑세스토큰이있으나 검증실패면 로그인페이지
                    next();
                }
            } else {
                //엑세스토큰 없으면 다음 로그인페이지 라우터
                next();
            }
        } else {
            //토큰 없으면 다음 로그인페이지 라우터
            next();
        }
    } catch (error) {
        //토큰 없으면 다음 로그인페이지 라우터
        next();
    }
}

export default blockGoToInit;
