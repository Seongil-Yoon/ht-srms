import express from 'express';
import {refresh} from '../utils/refresh.js';
import {authJWT} from '../utils/auth-middleware.js';
import blockGoToInit from '../utils/init-middleware.js';

import UserController from '../controllers/user-controller.js';
import ItemManageController from '../controllers/item-manage-controller.js';
import MyrentStatusController from '../controllers/myrent-status-controller.js';
import AllrentStatusController from '../controllers/allrent-status-controller.js';
import UserManageController from '../controllers/user-manage-controller.js';

const router = express();

router
    .route(['/', '/login'])
    .get(blockGoToInit, UserController.getLoginPage)
    .post(UserController.postLogin);
router.post('/logout', authJWT, UserController.userLogout);
router
    .route('/register')
    .get(UserController.getRegisterPage)
    .post(UserController.postRegister);
router.post('/register/vali-userid', UserController.valiUserId);

router.route('/item-manage').get(authJWT, ItemManageController.getItemPage);
router.route('/myrent-status').get(authJWT, MyrentStatusController.getItemPage);
router
    .route('/allrent-status')
    .get(authJWT, AllrentStatusController.getItemPage);
router.route('/user-manage').get(authJWT, UserManageController.getItemPage);
router.post('/refresh', refresh);

export default router;
/**
 * ES6 문법
 * export 할 경우에는 import { 함수명 } from * 으로 사용
 * export default 하실 경우에는 import 함수명 from * 으로 사용
 */
