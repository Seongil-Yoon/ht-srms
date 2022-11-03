import express from 'express';
import ItemService from '../service/item-service.js';

const router = express();

const ItemManageController = {
    getItemPage: (req, res) => {
        res.render('item/item-manage', {
            userInfo: req.body,
        });
    },
    getInsertItemPage: (req, res) => {
        res.render('item/item-insert', {
            userInfo: req.body,
        });
    },
    getItemList: (req, res) => {},
    getItem: (req, res) => {},
    insertItem: (req, res) => {},
    updateItem: (req, res) => {},
    deleteItem: (req, res) => {},
    getHistoryListByItem: (req, res) => {},
    getRenterListByItem: (req, res) => {
        const itemId = req.params.itemId;
        res.status(200).send({
            ok: true,
            message: `${itemId}대여자 이력`,
        });
    },
    exportByAllItemList: (req, res) => {},
};

export default ItemManageController;