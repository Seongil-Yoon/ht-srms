import ItemService from '../service/item-service.js';

const AllrentStatusController = {
    getItemPage: (req, res) => {
        res.render('allrent/allrent-status', {
            userInfo: req.body,
        });
    },
};

export default AllrentStatusController;
