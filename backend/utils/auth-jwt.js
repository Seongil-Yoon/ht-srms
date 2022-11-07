import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {User} from '../schemas/userSchema.js';

const customJwt = {
    sign: (user) => {
        // access token 발급
        const payload = {
            // access token에 들어갈 payload
            _id: user._id,
            id: user.userId,
            role: user.userRole,
            name: user.userName,
        };
        return jwt.sign(payload, process.env.JWT_SECRET, {
            // process.env.JWT_SECRET으로 sign하여 발급하고 return
            algorithm: 'HS256',
            expiresIn: '1h',
            issuer: 'kshired',
        });
    },
    verify: (token) => {
        let decoded = null;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            return {
                ok: true,
                _id: decoded._id,
                id: decoded.id,
                role: decoded.role,
                name: decoded.name,
            };
        } catch (err) {
            return {
                ok: false,
                message: err.message,
            };
        }
    },
    refresh: () => {
        // refresh token 발급
        return jwt.sign({}, process.env.JWT_SECRET, {
            // refresh token은 payload 없이 발급
            algorithm: 'HS256',
            expiresIn: '3d',
            issuer: 'kshired',
        });
    },
    refreshVerify: async (token, userId) => {
        try {
            const data = await User.findOne({
                userId: userId,
            });
            if (token === data.refreshToken) {
                try {
                    //리프레쉬토큰 검증
                    jwt.verify(token, process.env.JWT_SECRET);
                    return {
                        ok: true,
                    };
                } catch (error) {
                    console.log('jwt expiredAt : ', error.expiredAt);
                    return {
                        ok: false,
                    };
                } //end of inner try-catch
            } else {
                return {
                    ok: false,
                };
            }
        } catch (err) {
            return {
                ok: false,
            };
        } //end of outer try-catch
    },
};

export default customJwt;
