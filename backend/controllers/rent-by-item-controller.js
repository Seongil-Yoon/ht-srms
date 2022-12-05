import express from 'express';
import {ObjectId} from 'mongodb';
import RentDTO from '../dto/rent-dto.js';
import RentService from '../service/rent-service.js';

const router = express();

const RentByItemController = {
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

            RentService.renterDupliChk(req, itemDoc);
            newRentDto = req.body;
            newRentDto.renter._id = ObjectId(req._id);
            newRentDto.renter.userId = req.userId;
            newRentDto.renter.userRole = req.userRole;
            newRentDto.renter.userName = req.userName;
            newRentDto.renter.userDept = req.userDept;
            newRentDto.renter.userPosition = req.userPosition;
            newRentDto.rentedItem._id = ObjectId(newRentDto.rentedItem._id);
            newRentDto.expectReturnAt =
                newRentDto.expectReturnAt ||
                (() => {
                    let dt = new Date();
                    dt.setFullYear(dt.getFullYear() + 100);
                    return dt;
                })();
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
     * 1건의 물품에 인증사용자가 대여했는지 체크. 이미 대여 했다면 예외던짐
     */
    renterDupliChk: async (req, res) => {
        let itemDoc;
        try {
            itemDoc = await RentService.selectRentByItem(
                req.params.itemObjectId
            );
            RentService.renterDupliChk(req, itemDoc);
            res.status(200).json({
                ok: true,
                message: `대여 가능`,
            });
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

export default RentByItemController;
