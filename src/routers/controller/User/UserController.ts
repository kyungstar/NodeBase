
import {Request, Response} from "express";

const fs = require('fs');
const path = require('path');
const moment = require('moment')
import * as CryptoJS from 'crypto-js';

import ResController from "../ResController";


import Logger from "../../../modules/Logger";
import DataChecker from "../../util/DataChecker";

import UserService from "../../service/user/UserService";

const { AES } = CryptoJS;

const Date = moment().format('YYYYMMDD');

class UserController extends ResController {


    public userJoin = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl + ' 뿌잉');

        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, [
                "loginId", "pwd", "userType", "email", "phoneNumber", "gender", "name"
            ]),
            DataChecker.stringArrCheck(res, req.body, [
                "address", "addressDetail", "nickName"
            ], false)
        ) as {
            loginId: string,
            pwd: string,
            userType: string,
            email: string,
            phoneNumber: string,
            gender: string,
            address: string,
            addressDetail: string,
            name: string,
            nickName: string
        };


        let result = await UserService.Join(data.loginId, data.pwd, data.userType, data.email, data.name, data.nickName, data.phoneNumber, data.gender
            , data.address, data.addressDetail);

        if(result)
            return this.true(res,'JS0', {token: result});
        else
            return this.false(res, 'LA');


    }



    public userEmail = async (req: Request, res: Response) => {

        try {

            let data = DataChecker.mergeObject(
                DataChecker.needArrCheck(res, req.body, ['email'])
            ) as {
                email: string
            }

            let result = await UserService.emailCheck(data.email);

            if(result)
                return this.true(res, '01');
            else
                return this.false(res, '01');


        } catch (err) {
            Logger.debug(err + 'is Occured');
            return this.err(res, 'A01', err);
        }

    }

    public userPhone = async (req: Request, res: Response) => {

        try {

            let data = DataChecker.mergeObject(
                DataChecker.needArrCheck(res, req.body, ['phone'])
            ) as {
                phone: string
            }

            //todo 전화번호 추가 작업 필요
            let result = await UserService.phoneCheck(data.phone);

            if(result)
                return this.true(res, '01');
            else
                return this.false(res, '01');


        } catch (err) {
            Logger.debug(err + ' is Occured');
            return this.err(res, 'A01', err);
        }

    }




}


export default new UserController();