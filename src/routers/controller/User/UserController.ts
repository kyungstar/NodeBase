import {application, Request, Response} from "express";

import ResController from "../ResController";


import Logger from "../../../modules/Logger";
import DataChecker from "../../util/DataChecker";

import UserService from "../../service/user/UserService";
import MailService from "../../service/mail/MailService";
import {log} from "winston";

class UserController extends ResController {

    public userAuth = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, [
                "loginId", "authType", "authPwd"
            ])
        ) as {
            loginId: string,
            authType: string,
            authPwd: string

        };

        if (typeof data == 'string') {
            return this.clientReqError(res, data);
        }

        try {

            const userData = await UserService.checkUserAuth(data.loginId, data.authType, data.authPwd);

            if (userData)
                this.true(res, 'AS0')
            else
                this.false(res, 'AF0')

        } catch (err) {

        }

    }

    public sendAuth = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.stringArrCheck(res, req.body, [
                "loginId", "authType"
            ], true)
        ) as {
            loginId: string,
            authType: string
        };


        if (typeof data == 'string') {
            return this.clientReqError(res, data);
        }

        const userData = await UserService.getUserData(data.loginId);

        if (!userData) {
            this.false(res, '01')
            return;
        }

        const userAuthData = await UserService.getUserAuthData(data.loginId, data.authType);

        if (!userAuthData) {
            this.false(res, '01');
            return;
        }

        const mailResult = await MailService.authEmail(userData.email, data.authType, userAuthData.cotents);

        if (mailResult.accepted[0].includes(userData.email))
            this.true(res, 'UA0');
        else
            this.false(res, 'UA1')

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

        if (typeof data == 'string') {
            return this.clientReqError(res, data);
        }

        let userJoinResult = await UserService.Join(data.loginId, data.pwd, data.userType, data.email, data.name, data.nickName, data.phoneNumber, data.gender
            , data.address, data.addressDetail);


       return DataChecker.resultInterpreter(res, userJoinResult);


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


        let accessInfo = await UserService.Access(res, data.loginId, data.pwd)

        console.log(accessInfo);

        // 세션 등록 추가
        DataChecker.resultInterpreter(res, accessInfo)
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

            return DataChecker.resultInterpreter(res, emailCheckResult);


        } catch (err) {
            return this.err(res, err);
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
                return this.clientReqError(res, data);
            }

            let phoneCheckResult = await UserService.phoneCheck(data.phoneNumber);

            return DataChecker.resultInterpreter(res, phoneCheckResult)


        } catch (err) {
            Logger.debug(err + ' is Occured');
            return this.err(res, err);
        }

    }

    public resetPw = async (req: Request, res: Response) => {

        try {

            let data = DataChecker.mergeObject(
                DataChecker.needArrCheck(res, req.body, ['loginId', 'originPwd', 'newPwd'])
            ) as {
                loginId: string,
                originPwd: string,
                newPwd: string
            }

            if (typeof data == 'string') {
                return this.clientReqError(res, data);
            }

            /*          let updateResult = await UserService.updatePwd(data.loginId, data.originPwd, data.newPwd);

                 /!*     if (updateResult.result)
                          this.true(res, updateResult);
                      else
                          this.false(res, updateResult);*!/*/

        } catch (err) {
            Logger.debug(err + 'is Occured');
            return this.err(res, err);
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

            /*   let result = await UserService.updateUser(data.loginId, data.email, data.phoneNumber, data.address, data.addressDetail);

               if (result)
                   this.true(res, '01');
               else
                   this.false(res, '02');
   */

        } catch (err) {
            Logger.debug(err + 'is Occured');
            return this.err(res, err);
        }
    }

}


export default new UserController();
