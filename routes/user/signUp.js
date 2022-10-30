import bcrypt from 'bcrypt';
import {customJwt} from '../../auth/auth-jwt.js';;
import {User} from '../../schemas/userSchema.js';

const signUp = async (req, res) => {
    const {userId, userName, userPassword} = req.body;
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    try {
        const user = await User.create({
            userId,
            userName,
            userPassword: hashedPassword,
        });
        const token = customJwt.sign(user);

        res.status(200).send({
            ok: true,
            data: {
                token,
            },
        });
    } catch (err) {
        res.status(409).send({
            ok: false,
            message: err.message,
        });
    }
};

export {signUp};
