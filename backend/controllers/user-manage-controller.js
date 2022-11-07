import ItemService from '../service/item-service.js';

const UserManageController = {
    getAdminPage: (req, res) => {
        res.render('admin/user-manage', {
            userInfo: {
                _id: req._id,
                userId: req.userId,
                userRole: req.userRole,
                userName: req.userName,
            },
        });
    },
};

export default UserManageController;
