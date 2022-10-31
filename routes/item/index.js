import express from 'express';

import {authJWT} from '../../utils/auth.js';

const router = express.Router();

/**
 * uri : /item/*
 */
router.route('/').get(authJWT, (req, res) => {
    res.render('item/item-manage');
});

export default router;
