import UserService from '../service/user-service.js';
import bcrypt from 'bcrypt';
import {User} from '../schemas/userSchema.js';
import customJwt from '../utils/auth-jwt.js';

const UserController = {
    getLoginPage: (req, res) => {
        res.render('user/login');
    },
    postLogin: async (req, res) => {
        const {userId, userPassword} = req.body;
        const user = await User.findOne({userId});
        if (user) {
            const chk = await bcrypt.compare(userPassword, user.userPassword);
            if (chk) {
                user.userPassword = undefined;
                const accessToken = customJwt.sign(user);
                const refreshToken = customJwt.refresh();

                await User.findOneAndUpdate(
                    {userId: user.userId},
                    {
                        $set: {
                            refreshToken: refreshToken,
                        },
                    }
                );

                res.cookie('accessToken', accessToken);
                res.cookie('refreshToken', refreshToken);
                res.status(200).send({
                    ok: true,
                    data: {
                        accessToken,
                        refreshToken,
                    },
                });
                return;
            } else {
                res.status(401).send({
                    ok: false,
                    message: '사번 혹은 비밀번호가 틀립니다',
                });
                return;
            }
        }
        res.status(401).send({
            ok: false,
            message: '등록되지 않은 사용자입니다',
        });
    },
    getRegisterPage: (req, res) => {
        res.render('user/register');
    },
    postRegister: async (req, res) => {
        const {userId, userName, userPassword} = req.body;
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        try {
            const user = await User.create({
                userId,
                userName,
                userPassword: hashedPassword,
            });
            const token = customJwt.sign(user);
            res.cookie('accessToken', token);

            res.status(200).send({
                ok: true,
                message: 'accessToken Created!',
            });
        } catch (err) {
            res.status(409).send({
                ok: false,
                message: err.message,
            });
        }
    },
    valiUserId: async (req, res) => {
        const {userId} = req.body;
        const user = await User.findOne({userId});
        try {
            if (user === null) {
                res.status(200).send({
                    ok: true,
                    message: '사용가능한 사번입니다',
                });
            } else {
                res.status(401).send({
                    ok: false,
                    message: '❌이미 등록된 사람입니다',
                });
            }
        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    },
};

export default UserController;
