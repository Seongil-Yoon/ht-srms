import ItemService from '../service/item-service.js';

const UserManageController = {
    getItemPage: (req, res) => {
        res.render('admin/user-manage', {
            userInfo: req.body,
        });
    },
};

export default UserManageController;
