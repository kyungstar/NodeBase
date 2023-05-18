
import express from "express";
import Logger from "../../../src/modules/Logger";


export default class ResController {

    public clientReqError<T>(res: express.Response, msg: string) {

        let dto = {
            result: false,
            code: 'CUP',
            msg:  msg
        };

        res.type('application/json');
        return res.status(200).json(dto);

    }


    public dataCheck<T>(res: express.Response, data: any, msg: string) {

        let dto = {
            result: false,
            msg: data + msg
        };


        res.type('application/json');
        return res.status(200).json(dto);

    }


    // T는 Type의 약자로 다른 언어에서도 제네릭을 선언할 때 관용적으로 많이 사용된다. 이 부분에는 식별자로 사용할 수 있는 것이라면 무엇이든 들어갈 수 있다.
    public true<T>(res: express.Response, code: string, dto?: T) {

        if (!dto) { // @ts-ignore
            dto = {};
        }

        // @ts-ignore
        dto.result = true;
        // @ts-ignore
        dto.code = code;

        res.type('application/json');

        return res.status(200).json(dto);

    }

    public false<T>(res: express.Response, code: string) {

        let dto = {
            result: false,
            code: code
        };


        res.type('application/json');
        return res.status(200).json(dto);

    }



    public err<T>(res: express.Response, err: string) {

        let dto = {
            result: false,
            code: '03',
            msg: 'Error Occurred By ' + err
        };

        Logger.error(err + ' is Occurred')

        res.type('application/json');
        return res.status(200).json(dto);

    }

};
