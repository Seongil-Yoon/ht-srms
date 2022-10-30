/**
 * 인증이 필요한 Express_router에 사용 할 middleware
 */
import {customJwt} from '../auth/auth-jwt.js';

const authJWT = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ')[1];
        const result = customJwt.verify(token);
        if (result.ok) {
            req.userId = result.userId;
            req.userRole = result.userRole;
            next();
        } else {
            res.status(401).send({
                ok: false,
                message: result.message,
            });
        }
    }
};

export {authJWT};
