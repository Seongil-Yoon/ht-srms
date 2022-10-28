import express from "express";
import {
    v4
} from "uuid";
import {
    User
} from "../schemas/user"

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const user = await User.findOne({
            id: req.user && req.user.id || null
        });
        res.render('login', {
            user
        });
    } catch (err) {
        console.error(err);
        next(err); //응답안하고 다음 미들웨어(요청과 응답을가진 메서드)로 넘김
    }
});

module.exports = router;