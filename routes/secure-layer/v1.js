/**
 * JWT토큰을 발급하는 라우터
 */
import express from "express";
import jwt from "jsonwebtoken";

import {
    JwtMiddleWares
} from "./middlewares";
import {
    Domain,
    User
} from "../../schemas";

const router = express.Router();
const jwtMiddleWares = new JwtMiddleWares();

router.post('/token', async (req, res) => {
    const {
        clientSecret
    } = req.body;
    try {
        const token = jwt.sign({
            id: domain.User.id,
            nick: domain.User.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '1m', // 1분
            issuer: 'nodebird',
        });
        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다',
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});

router.get('/test', jwtMiddleWares.verifyToken, (req, res) => {
    res.json(req.decoded);
});

module.exports = router;