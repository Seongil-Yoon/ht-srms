import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {User} from '../schemas/userSchema.js';

const customJwt = {
    sign: (user) => {
        // access token 발급
        const payload = {
            // access token에 들어갈 payload
            id: user.userId,
            role: user.userRole,
        };
        return jwt.sign(payload, process.env.JWT_SECRET, {
            // process.env.JWT_SECRET으로 sign하여 발급하고 return
            algorithm: 'HS256',
            expiresIn: '5m',
            issuer: 'kshired',
        });
    },
    verify: (token) => {
        let decoded = null;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            return {
                ok: true,
                id: decoded.id,
                role: decoded.role,
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
            expiresIn: '1h',
            issuer: 'kshired',
        });
    },
    refreshVerify: async (token, userId) => {
        // refresh token 검증
        const data = await User.findOne({
            userId: userId,
        }).refreshToken;

        try {
            if (token === data) {
                return {
                    ok: true,
                };
            } else {
                return {
                    ok: false,
                };
            }
        } catch (err) {
            return {
                ok: false,
            };
        }
    },
};

export {customJwt};
