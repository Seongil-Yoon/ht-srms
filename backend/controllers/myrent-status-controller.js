import {ObjectId} from 'mongodb';
import UserDTO from '../dto/user-dto.js';
import RentDTO from '../dto/rent-dto.js';
import ItemService from '../service/item-service.js';
import RentService from '../service/rent-service.js';
import ExceptionAdvice from '../utils/exception-advice.js';

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
    getRentListByUser: async (req, res) => {
        let result = false;
        let {pageNum} = req.query;
        try {
            result = await RentService.selectRentListByUser(
                ObjectId(req._id),
                pageNum
            );
            if (result !== false) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    ok: false,
                    message: `찾는 대여 없음`,
                });
            }
        } catch (error) {
            console.log(error);
            ExceptionAdvice.item(req, res, error);
        }
    },
    returnItemByUesr: async (req, res) => {
        try {
            
        } catch (error) {
            console.log(error);
        }
    },
};

export default MyrentStatusController;
