import express from 'express';
import {login} from './login.js';
import {signUp} from './signUp.js';
import {refresh} from './refresh.js';
import {authJWT} from '../../utils/auth.js';

const router = express.Router();

router
    .route(['/','/login'])
    .get((req, res) => {
        res.render('user/login');
    })
    .post(login);
router
    .route('/signup')
    .get((req, res) => {
        res.render('user/signup');
    })
    .post(signUp);

router.post('/refresh', refresh);

export default router;
