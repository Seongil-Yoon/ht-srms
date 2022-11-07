import ItemService from '../service/item-service.js';

const MyrentStatusController = {
    getMyrentPage: (req, res) => {
        res.render('myrent/myrent-status', {
            userInfo: {
                _id: req._id,
                userId: req.userId,
                userRole: req.userRole,
                userName: req.userName,
            },
        });
    },
    getMyrentList: (req, res) => {},
    insertRent: (req, res) => {},
    getMyrent: (req, res) => {},
    returnMyrent: (req, res) => {},
};

export default MyrentStatusController;
