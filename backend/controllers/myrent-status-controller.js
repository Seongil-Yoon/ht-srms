import ItemService from '../service/item-service.js';

const MyrentStatusController = {
    getItemPage: (req, res) => {
        res.render('myrent/myrent-status', {
            userInfo: req.body,
        });
    },
};

export default MyrentStatusController;
