import express from 'express';
import {refresh} from '../utils/refresh.js';
import {authJWT} from '../utils/authen-middleware.js';
import {hasRole} from '../utils/author-middleware.js';
import blockGoToInit from '../utils/init-middleware.js';

import UserController from '../controllers/user-controller.js';
import ItemManageController from '../controllers/item-manage-controller.js';
import MyrentStatusController from '../controllers/myrent-status-controller.js';
import AllrentStatusController from '../controllers/allrent-status-controller.js';
import UserManageController from '../controllers/user-manage-controller.js';

const router = express();

/* ========== 로그인 및 회원가입 ========== */
router
    .route(['/', '/login'])
    .get(blockGoToInit, UserController.getLoginPage)
    .post(UserController.postLogin);

router
    .route('/register')
    .get(UserController.getRegisterPage)
    .post(UserController.postRegister);
router.post('/register/vali-userid', UserController.valiUserId);
/* ====== end of 로그인 및 회원가입 ======= */

router.use(authJWT); //JWT인증 미들웨어 : 반드시 초기화면 라우터 이후에 호출
router.post('/logout', UserController.userLogout);

/* ========== 물품 ========== */
router.route('/item-manage-page').get(ItemManageController.getItemPage);
router
    .route('/item-manage-page/insert-item-page')
    .get(ItemManageController.getInsertItemPage);
router
    .route('/item')
    .get(ItemManageController.getItemList)
    .post(hasRole('write', 'edit', 'admin'), ItemManageController.insertItem);
router
    .route('/item/:itemId')
    .get(ItemManageController.getItem)
    .put(hasRole('edit', 'admin'), ItemManageController.updateItem)
    .delete(hasRole('edit', 'admin'), ItemManageController.deleteItem);
router
    .route('/item/rent-history/:itemId')
    .get(ItemManageController.getHistoryListByItem);
router
    .route('/item/renter-list/:itemId')
    .get(hasRole('admin'), ItemManageController.getRenterListByItem);
router.get(
    '/item/export-xlxs',
    hasRole('read'),
    ItemManageController.exportByAllItemList
);
/* ========== end of 물품 ========== */

/* ========== 나의 대여 ========== */
router.route('/myrent-status-page').get(MyrentStatusController.getMyrentPage);
router
    .route('/rent')
    .get(MyrentStatusController.getMyrentList)
    .post(hasRole('rent', 'admin'), MyrentStatusController.insertRent);
router
    .route('/rent/:rentId')
    .get(MyrentStatusController.getMyrent)
    .put(MyrentStatusController.returnMyrent);
/* ========== end of 나의 대여 ========== */

/* ========== 전체 대여 현황 ========== */
router
    .route('/allrent-status-page')
    .get(hasRole('read', 'admin'), AllrentStatusController.getAllrentPage);
/* ========== end of 전체 대여 현황 ========== */

/* ========== 이용자 관리 ========== */
router
    .route('/user-manage-page')
    .get(hasRole('admin'), UserManageController.getAdminPage);
/* ========== end of 이용자 관리 ========== */

router.post('/refresh', refresh);

export default router;
/**
 * ES6 문법
 * export 할 경우에는 import { 함수명 } from * 으로 사용
 * export default 하실 경우에는 import 함수명 from * 으로 사용
 */
