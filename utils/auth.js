/**
 * 인증이 필요한 Express_router에 사용 할 middleware
 */
import {customJwt} from '../auth/auth-jwt.js';
import {convertCookieToObject} from '../utils/cookie-util.js';
import cookieParser from 'cookie-parser';

const authJWT = (req, res, next) => {
    const tokenInCookie = convertCookieToObject(req.headers.cookie);
    if (tokenInCookie.accessToken) {
        const result = customJwt.verify(tokenInCookie.accessToken);
        if (result.ok) {
            req.userId = result.userId;
            req.userRole = result.userRole;
            next();
        } else {
            res.redirect('/');
            res.status(401).json({
                ok : false,
                message: 'logout!',
            });
        }
    }
};

export {authJWT};
