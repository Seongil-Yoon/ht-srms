import express from 'express';
import {login} from './login.js';
import {register} from './register.js';
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
    .route('/register')
    .get((req, res) => {
        res.render('user/register');
    })
    .post(register);

router.post('/refresh', refresh);

export default router;
