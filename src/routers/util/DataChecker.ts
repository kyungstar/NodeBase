/**
 * Created By 강영규 On 2022-11-13
 */
//import ResController from "../controller/ResController";
import ResController from "../controller/ResController";
import express from "express";


class DataChecker extends ResController {

    // 토큰 꺼내기
    public loadJWTValue(objData: any) {
        return {
            userId: objData.userId,
            userType: objData.userType
        }
    }

    // 토큰 관리자 검증하기
    public loadJWTAdminCheck(res: any, objData: any) {

        if (objData.userType !== 'ADMIN')
            return this.false(res, 'A01')
    }


    // 토큰 사용자 검증하기
    public loadJWTUserCheck(res: any, objData: any) {
        if (objData.userType !== 'USER' && objData.userType !== 'ADMIN')
            return this.false(res, 'U01');
    }


    // 필수 값 검증
    public needArrCheck(res: any, objData: any, needArr: string[]) {

        let retObj = {};
        let dataFailList = [];

        for (let item of needArr) {

            if (objData[item] === undefined || objData[item] === "") {
                dataFailList.push(item)
            }

            // @ts-ignore
            retObj[item] = objData[item];

        }

        if (dataFailList.length > 0) {
            return this.dataCheck(res, dataFailList, ' Is Essential Data');
        }


        return retObj;
    }


    public numberArrCheck(res: any, objData: any, numberArr: string[], isRequire: boolean) {

        let retObj = {};

        for (let item of numberArr) {

            if ((item == '' || item == undefined) && isRequire === true) {
                return this.dataCheck(res, item, '  Is Essential Data')
            }

            // @ts-ignore
            retObj[item] = parseInt(objData[item]);

        }

        return retObj;
    }

    public dataCheck<T>(res: express.Response, data: any, msg: string) {

        let dto = {
            result: false,
            msg: data + msg
        };

        return res.status(200).json(dto);

    }


    public stringArrCheck(res: any, objData: any, strArr: string[], isRequire: boolean) {

        let retObj = {};
        let failItemList = [];

        for (let item of strArr) {

            if ((objData[item] == '' || objData[item] == undefined) && isRequire === true) {
                return this.dataCheck(res, item, '  Is Essential Data')
            }

            // @ts-ignore
            retObj[item] = objData[item];

        }

        return retObj;
    }


    public mergeObject(...objList: any[]) {
        let obj = {};

        for (let item of objList) {
            if (typeof item === "string") {
                return item;
            }

            Object.assign(obj, item);
        }

        return obj;

    }
}

export default new DataChecker();