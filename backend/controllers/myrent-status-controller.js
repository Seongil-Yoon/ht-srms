import ItemService from '../service/item-service.js';

const MyrentStatusController = {
    getMyrentPage: (req, res) => {
        res.render('myrent/myrent-status', {
            userInfo: req.body,
        });
    },
    getMyrentList: (req, res) => {},
    insertRent: (req, res) => {},
    getMyrent: (req, res) => {},
    returnMyrent: (req, res) => {},
};

export default MyrentStatusController;
