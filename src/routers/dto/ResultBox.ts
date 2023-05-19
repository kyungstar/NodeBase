import {token} from "morgan";
import Logger from "../../modules/Logger";
import express from "express";


export default class ResultBox {


    static JustFalse(code: string) {

        let dto = {
            result: false,
            code: code
        };

        return dto;
    }

    static JustTrue(code: string) {

        let dto = {
            result: true,
            code: code
        };

        return dto;

    }

    static JustTrueObj(code: string, resultObj: object) {

        let dto = {
            result: true,
            code: code,
            resultObj: resultObj
        };

        return dto;

    }
/*    static JustTrue(res, code: string) {
        if (!dto) { // @ts-ignore
            dto = {};
        }

        // @ts-ignore
        dto.result = true;
        // @ts-ignore
        dto.code = code;

        res.type('application/json');

        return res.status(200).json(dto);
    }*/

    static JustErr(err: string) {

        err = err.substring(0, 10);

        Logger.debug(err + ' is Occured');
        return {result: false, code: '03', err: err + ' is Occurred'};
    }



}