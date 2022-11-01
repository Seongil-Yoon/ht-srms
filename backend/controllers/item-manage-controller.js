import ItemService from '../service/item-service.js';

const ItemManageController = {
    getItemPage: (req, res) => {
        res.render('item/item-manage');
    },
};

export default ItemManageController;
