import express from 'express';
import ItemService from '../service/item-service.js';

const router = express();

const ItemManageController = {
    getItemPage: (req, res) => {
        res.render('item/item-manage', {
            userInfo: req.body,
        });
    },
};

export default ItemManageController;
