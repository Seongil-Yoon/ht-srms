/**
 * 인증이 필요한 Express_router에 사용 할 middleware
 */
import customJwt from './auth-jwt.js';
import {convertCookieToObject} from './cookie-util.js';
import isEmptyObj from './isEmptyObj.js';

const authJWT = (req, res, next) => {
    const tokenInCookie = convertCookieToObject(req.headers.cookie);
    try {
        if (tokenInCookie !== undefined) {
            if (tokenInCookie.accessToken) {
                const result = customJwt.verify(tokenInCookie.accessToken);
                if (result.ok) {
                    req.body = {
                        userId: result.id,
                        userRole: result.role,
                        userName: result.name,
                    };
                    next();
                } else {
                    return res.redirect('/');
                }
            }
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        return res.redirect('/');
    }
};

export {authJWT};
