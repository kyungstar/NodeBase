import {token} from "morgan";
import Logger from "../../modules/Logger";
import express from "express";


export default class ResultBox {


    static JustFalse(code: string) {

        return {result: false, code: code};
    }

    static JustTrue(code: string) {

        return {result: true, code: code};
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

        Logger.debug(err + 'is Occured');
        return {result: false, code: '03', err: err + ' Is Occurred'};
    }



}