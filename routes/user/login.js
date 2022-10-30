import bcrypt from 'bcrypt';
import {customJwt} from '../../auth/auth-jwt.js';
import {User} from '../../schemas/userSchema.js';

const ComparePassword = (req, res, next) => {
    User.findOne({userId: req.body.userId})
        .exec()
        .then((userInfo) => {
            if (!userInfo) {
                req.flash('message', '입력한 아이디가 없습니다.');
                res.redirect('/login');
            } else {
                //사용자가 입력한 비밀번호가 틀렸을 때
                if (req.body.userPassword != userInfo.userPassword) {
                    req.flash('message', '비밀번호가 일치하지 않습니다.');
                    res.redirect('/login');
                }
                res.locals.userInfo = userInfo;
                next();
            }
        });
};

const login = async (req, res) => {
    const {userId, userPassword} = req.body;
    const user = await User.findOne({userId});
    console.log(user);
    if (user) {
        const chk = await bcrypt.compare(userPassword, user.userPassword);
        if (chk) {
            const accessToken = customJwt.sign(user);
            const refreshToken = customJwt.refresh();

            await User.findOneAndUpdate(user.userId, refreshToken);
            
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
                message: 'password is incorrect',
            });
            return;
        }
    }
    res.status(401).send({
        ok: false,
        message: 'user not exist',
    });
};

export {login};
