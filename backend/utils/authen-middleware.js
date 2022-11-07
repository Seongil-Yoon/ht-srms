/**
 * 인증이 필요한 Express_router에 사용 할 middleware
 */
import customJwt from './auth-jwt.js';
import {convertCookieToObject} from './cookie-util.js';
import {refresh} from './refresh.js';
import isEmptyObj from './isEmptyObj.js';

const authJWT = (req, res, next) => {
    const tokenInCookie = convertCookieToObject(req.headers.cookie);
    try {
        if (tokenInCookie !== undefined) {
            if (tokenInCookie.accessToken) {
                const result = customJwt.verify(tokenInCookie.accessToken);
                if (result.ok) {
                    req._id = result._id;
                    req.userId = result.id;
                    req.userRole = result.role;
                    req.userName = result.name;
                    next();
                } else {
                    //엑세스토큰 만료시
                    refresh(req, res, next);
                }
            } else {
                return res.redirect('/');
            }
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
};

export {authJWT};
