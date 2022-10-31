import bcrypt from 'bcrypt';
import {customJwt} from '../../auth/auth-jwt.js';
import {User} from '../../schemas/userSchema.js';

const login = async (req, res) => {
    const {userId, userPassword} = req.body;
    const user = await User.findOne({userId});
    if (user) {
        const chk = await bcrypt.compare(userPassword, user.userPassword);
        if (chk) {
            const accessToken = customJwt.sign(user);
            const refreshToken = customJwt.refresh();
            res.cookie('accessToken', accessToken);
            res.cookie('refreshToken', refreshToken);

            await User.findOneAndUpdate(
                {userId: user.userId},
                {
                    $set: {
                        refreshToken: refreshToken,
                    },
                }
            );

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
};

export {login};
