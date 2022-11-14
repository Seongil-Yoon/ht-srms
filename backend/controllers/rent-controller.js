import express from 'express';
import {ObjectId} from 'mongodb';
import RentDTO from '../dto/rent-dto.js';
import RentService from '../service/rent-service.js';

const router = express();

const RentController = {
    /**
     * 각 물품당 대여정보 조회
     */
    getRentByItem: async (req, res) => {},

    /**
     * 각 물품 대여하기
     */
    postRentByItem: async (req, res) => {
        let result = false;
        let userDoc,
            itemDoc,
            thisItemRenter = undefined;
        try {
            let newRentDto = RentDTO;
            itemDoc = await RentService.selectRentByItem(
                req.params.itemObjectId
            );
            // if (userDoc.rentedItem.includes(req._id)) throw Error('dup renter');

            if (itemDoc.itemRentId !== undefined) {
                thisItemRenter = itemDoc.itemRentId.filter((e) => {
                    return e.renter._id.toString() === req._id;
                });
            }
            console.log("thisItemRenter: ", thisItemRenter);
            if (thisItemRenter.length > 0) {
                throw Error('dup renter');
            } else {
                newRentDto = req.body;
                newRentDto.renter._id = ObjectId(req._id);
                newRentDto.renter.userId = req.userId;
                newRentDto.renter.userRole = req.userRole;
                newRentDto.renter.userName = req.userName;
                newRentDto.renter.userDept = req.userDept;
                newRentDto.renter.userPosition = req.userPosition;
                newRentDto.rentedItem._id = ObjectId(newRentDto.rentedItem._id);
                newRentDto.isExpire = false;
                newRentDto.isReturned = false;
                newRentDto.createdAt = Date.now();

                result = await RentService.createRentByItem(req, newRentDto);
                if (result !== false) {
                    res.status(200).json({
                        ok: true,
                        message: `물품 대여 성공`,
                    });
                } else {
                    res.status(404).json({
                        ok: false,
                        message: `찾는 물품 없음`,
                    });
                }
            }
        } catch (error) {
            console.log(error);
            if (error.message === 'dup renter') {
                res.status(400).json({
                    ok: false,
                    message: `이미 대여하신 물품입니다`,
                });
            } else {
                res.status(500).json({
                    ok: false,
                    message: `죄송합니다`,
                });
            }
        }
    },

    /**
     * 각 물품당 대여정보 변경
     */
    updateRentByItem: async (req, res) => {},

    /**
     * 각 물품의 대여 반납하기
     */
    returnRentByItem: async (req, res) => {},
};

export default RentController;
