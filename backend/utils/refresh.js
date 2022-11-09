import jwt from 'jsonwebtoken';
import customJwt from './auth-jwt.js';
import {convertCookieToObject} from './cookie-util.js';
import cookieParser from 'cookie-parser';

const refresh = async (req, res, next) => {
    const tokenInCookie = convertCookieToObject(req.headers.cookie);
    //undefined때문에 try-catch처리
    try {
        // access token과 refresh token의 존재 유무를 체크합니다.
        if (tokenInCookie.accessToken && tokenInCookie.refreshToken) {
            // const authToken = req.headers.authorization.split('Bearer ')[1];
            const authToken = tokenInCookie.accessToken;
            const refreshToken = tokenInCookie.refreshToken;

            // access token 검증 -> expired여야 함.
            const authResult = customJwt.verify(authToken);

            // access token 디코딩하여 user의 정보를 가져옵니다.
            const decoded = jwt.decode(authToken);

            // 디코딩 결과가 없으면 권한이 없음을 응답.
            if (decoded === null) {
                res.status(200).send({
                    ok: false,
                    message: 'No authorized!',
                });
            }
            /* access token의 decoding 된 값에서
          유저의 id를 가져와 refresh token을 검증합니다. */
            const refreshResult = await customJwt.refreshVerify(
                refreshToken,
                decoded.id
            );
            console.log('refreshResult : ', refreshResult);
            // 재발급을 위해서는 access token이 만료되어 있어야합니다.
            if (
                authResult.ok === false &&
                authResult.message === 'jwt expired'
            ) {
                // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
                if (refreshResult.ok === false) {
                    return res.redirect(`/?ok=false&msg=No authenticated!`);
                } else {
                    // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
                    const newAccessToken = customJwt.sign({
                        _id: decoded._id,
                        userId: decoded.id,
                        userRole: decoded.role,
                        userName: decoded.name,
                    });
                    req._id = decoded._id;
                    req.userId = decoded.id;
                    req.userRole = decoded.role;
                    req.userName = decoded.name;

                    // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환합니다.
                    res.cookie('accessToken', newAccessToken, {httpOnly: true});
                    res.cookie('refreshToken', refreshToken, {httpOnly: true});

                    next();
                }
            } else {
                // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
                return res.redirect(
                    `/?ok=true&msg=Acess token is not expired!`
                );
            }
        } else {
            // access token 또는 refresh token이 헤더에 없는 경우
            return res.redirect(
                `/?ok=false&msg=Access token and refresh token are need for refresh!`
            );
        }
    } catch (error) {
        // access token 또는 refresh token이 헤더에 없는 경우
        return res.redirect(
            `/?ok=false&msg=Access token and refresh token are need for refresh!`
        );
    }
};

export {refresh};
