import UserService from '../service/user-service.js';
import bcrypt from 'bcrypt';
import {User} from '../schemas/userSchema.js';
import UserDTO from '../dto/user-dto.js';
import customJwt from '../utils/auth-jwt.js';
import {Counter} from '../schemas/counterSchema.js';

const UserController = {
    getLoginPage: (req, res) => {
        res.render('user/login', {
            userInfo: false,
        });
    },
    postLogin: async (req, res) => {
        const userDto = new UserDTO(req.body);
        // const {userId, userPassword} = req.body;
        const result = await User.findOne({userId: userDto.userId})
            .where({
                isDelete: false,
            })
            .exec();
        if (result) {
            const chk = await bcrypt.compare(
                userDto.userPassword,
                result.userPassword
            );
            if (chk) {
                result.userPassword = undefined;
                const accessToken = customJwt.sign(result);
                const refreshToken = customJwt.refresh();

                await User.findOneAndUpdate(
                    {userId: result.userId},
                    {
                        $set: {
                            refreshToken: refreshToken,
                        },
                    }
                ).exec();

                res.cookie('accessToken', accessToken, {httpOnly: true});
                res.cookie('refreshToken', refreshToken, {httpOnly: true});
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
    userLogout: (req, res) => {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.redirect('/');
    },
    getRegisterPage: (req, res) => {
        res.render('user/register', {
            userInfo: false,
        });
    },
    postRegister: async (req, res) => {
        const {
            userId,
            userName,
            userPassword,
            userEmail,
            userDept,
            userPosition,
        } = req.body;
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        try {
            const counter = await Counter.findOneAndUpdate(
                {name: 'counter'},
                {
                    $inc: {
                        userNum: 1,
                    },
                }
            );
            const refreshToken = customJwt.refresh();
            const user = await User.create({
                userNum: counter.userNum,
                userId,
                userName,
                userPassword: hashedPassword,
                userEmail,
                userDept,
                userPosition,
                refreshToken: refreshToken,
            });

            const token = customJwt.sign(user);
            res.cookie('accessToken', token, {httpOnly: true});
            res.cookie('refreshToken', refreshToken, {httpOnly: true});

            res.status(200).send({
                ok: true,
                message: 'accessToken Created!',
            });
        } catch (error) {
            console.log(error);
            res.status(409).send({
                ok: false,
                message: err.message,
            });
        }
    },
    valiUserId: async (req, res) => {
        const {userId} = req.body;
        const user = await User.findOne({userId})
            .where({
                isDelete: false,
            })
            .exec();
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
