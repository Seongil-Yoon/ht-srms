import express from "express";
import bcrypt from "bcrypt";
import {
    JwtMiddleWares
} from "./middlewares";
import {
    User
} from "../../schemas";

const router = express.Router();
const jwtMiddleWares = new JwtMiddleWares();

router.post('/join', jwtMiddleWares.isNotLoggedIn, async (req, res, next) => {
    const {
        email,
        nick,
        password
    } = req.body;
    try {
        const exUser = await User.find({
            where: {
                email
            }
        });
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', jwtMiddleWares.isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', jwtMiddleWares.isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;