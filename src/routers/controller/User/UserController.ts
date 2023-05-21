import {application, Request, Response} from "express";

import ResController from "../ResController";


import Logger from "../../../modules/Logger";
import DataChecker from "../../util/DataChecker";
import mqttClient from "../../../ServerLoader/Target/MQTT";

import UserService from "../../service/user/UserService";
import MailService from "../../service/mail/MailService";
import Publisher from "../../service/mqtt/Publisher";
import {log} from "winston";


class UserController extends ResController {

    public userAuth = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, ["authType", "authPwd"]),
            DataChecker.stringArrCheck(res, req.body, ["loginId", "email"], false)
        ) as {
            authType: string,
            email: string,
            loginId: string,
            authPwd: string
        };

        if (typeof data == 'string') {
            return this.clientReqError(res, data);
        }

        try {

            const userData = await UserService.checkUserAuth(data.loginId, data.email, data.authType, data.authPwd);

            await Publisher.staticMqttPublish('/C/2/H/300', 'hello')
            this.resultInterpreter(res, userData);

        } catch (err) {
            this.errInterpreter(res, err);
        }

    }

    public sendAuth = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.stringArrCheck(res, req.body,["authType"], true),
            DataChecker.stringArrCheck(res, req.body,["loginId", "email"], false)
        ) as {
            loginId: string,
            authType: string,
            email: string
        };


        if (typeof data == 'string') {
            return this.clientReqError(res, data);
        }

        try {

            const mailResult = await MailService.authEmail(data.authType, data.loginId, data.email);

            this.resultInterpreter(res, mailResult);

        } catch (err) {
            this.errInterpreter(res, err);
        }

    }


    public userJoin = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

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

        try {
            if (typeof data == 'string') {
                return this.clientReqError(res, data);
            }

            let userJoinResult = await UserService.Join(data.loginId, data.pwd, data.userType, data.email, data.name, data.nickName, data.phoneNumber, data.gender
                , data.address, data.addressDetail);

            this.resultInterpreter(res, userJoinResult);

        } catch (err) {
            this.errInterpreter(res, err);
        }

    }

    public userLogin = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.stringArrCheck(res, req.body, ["loginId", "pwd"], true)
        ) as {
            loginId: string,
            pwd: string
        };


        if (typeof data == 'string') {
            return this.clientReqError(res, data);
        }


        try {

            let accessInfo = await UserService.Access(res, data.loginId, data.pwd);

            this.resultInterpreter(res, accessInfo);

        } catch (err) {
            this.errInterpreter(res, err);
        }


    }

    public userEmail = async (req: Request, res: Response) => {

        try {

            let data = DataChecker.mergeObject(
                DataChecker.needArrCheck(res, req.body, ['email'])
            ) as {
                email: string
            }

            if (typeof data == 'string') {
                return this.clientReqError(res, data);
            }

            let emailCheckResult = await UserService.emailCheck(data.email);

            this.resultInterpreter(res, emailCheckResult);


        } catch (err) {
            this.errInterpreter(res, err);
        }

    }

    public userPhone = async (req: Request, res: Response) => {

        try {

            let data = DataChecker.mergeObject(
                DataChecker.needArrCheck(res, req.body, ['phoneNumber'])
            ) as {
                phoneNumber: string
            }

            if (typeof data == 'string') {
                this.clientReqError(res, data);
            }

            let phoneCheckResult = await UserService.phoneCheck(data.phoneNumber);

            this.resultInterpreter(res, phoneCheckResult)


        } catch (err) {
            this.errInterpreter(res, err);
        }

    }

    public resetPw = async (req: Request, res: Response) => {

        try {

            let data = DataChecker.mergeObject(
                DataChecker.needArrCheck(res, req.body, ['newPwd']),
                DataChecker.loadJWTValue(req.body)
            ) as {
                newPwd: string,
                userId: string
            }

            if (typeof data == 'string') {
                return this.clientReqError(res, data);
            }

            let userPwdUpdate = await UserService.updatePwd(data.userId, data.newPwd);

            this.resultInterpreter(res, userPwdUpdate)

        } catch (err) {
            this.errInterpreter(res, err);
        }
    }


    public authPw = async (req: Request, res: Response) => {

        try {

            let data = DataChecker.mergeObject(
                DataChecker.needArrCheck(res, req.body, ['loginId', 'pwd'])
            ) as {
                loginId: string,
                pwd: string
            }

            if (typeof data == 'string') {
                return this.clientReqError(res, data);
            }

            let userPwdAuth = await UserService.authPwd(data.loginId, data.pwd);

            this.resultInterpreter(res, userPwdAuth)

        } catch (err) {
            this.errInterpreter(res, err);
        }
    }


    public updateUser = async (req: Request, res: Response) => {

        try {

            let data = DataChecker.mergeObject(
                DataChecker.needArrCheck(res, req.body, ['loginId']),
                DataChecker.stringArrCheck(res, req.body, ['email', 'phoneNumber', 'address', 'addressDetail'], false)
            ) as {
                loginId: string,
                email: string,
                phoneNumber: string,
                address: string,
                addressDetail: string
            }

            if (typeof data == 'string') {
                return this.clientReqError(res, data);
            }

        } catch (err) {
            this.errInterpreter(res, err);
        }
    }

}


export default new UserController();
