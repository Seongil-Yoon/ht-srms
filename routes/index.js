import express from 'express';
import userRouter from './user/index.js';
import itemRouter from './item/index.js';
import {authJWT} from '../utils/auth.js';

const router = express.Router();

router.use('/', userRouter);
router.use('/item', itemRouter);

export default router;
/**
 * ES6 문법
 * export 할 경우에는 import { 함수명 } from * 으로 사용
 * export default 하실 경우에는 import 함수명 from * 으로 사용
 */