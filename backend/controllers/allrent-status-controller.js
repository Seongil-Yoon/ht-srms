import ItemService from '../service/item-service.js';

const AllrentStatusController = {
    getAllrentPage: (req, res) => {
        res.render('allrent/allrent-status', {
            userInfo: {
                _id: req._id,
                userId: req.userId,
                userRole: req.userRole,
                userName: req.userName,
            },
        });
    },
};

export default AllrentStatusController;
