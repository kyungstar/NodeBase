
import express, {Request} from "express";
import Logger from "../../../src/modules/Logger";
import logger from "../../middlewares/MongoLogging";
import MongoLogging from "../../middlewares/MongoLogging";


export default class ResController {

    public errInterpreter(req: Request, res: express.Response, err: string) {

        try {
            this.err(res, err);

        } catch (err) {
            this.err(res, err);
        }

    }

    public onlyResultInterpreter(apiResponse: Object, type: boolean) {

        if (typeof apiResponse === 'object') {

            // 타입을 판단한다.
            // 해당 Class의 참, 거짓 유무를 판단하기 위해 사용한다.
            if(type === false) {
                if((apiResponse as { result: any }).result === false && type === false)
                    return true;
                else
                    return false;
            } else {
                if((apiResponse as { result: any }).result === true && type === true)
                    return true;
                else
                    return false;
            }


        } else {
            return false;
        }

    }

    public async resultInterpreter(req: Request, res: express.Response, apiResponse: Object) {

        res.locals.data = apiResponse;

        await MongoLogging(req, res);

        if (typeof apiResponse === 'object') {

            if ((apiResponse as { result: any }).result === false)
                return this.false(res, apiResponse);
            else
                return this.true(res, apiResponse)

        } else {
            return this.false(res, apiResponse);
        }

    }

    // T는 Type의 약자로 다른 언어에서도 제네릭을 선언할 때 관용적으로 많이 사용된다. 이 부분에는 식별자로 사용할 수 있는 것이라면 무엇이든 들어갈 수 있다.
    public clientReqError<T>(req: Request, res: express.Response, msg: string) {

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



    public true<T>(res: express.Response, dto?: T) {

        if (!dto) { // @ts-ignore
            dto = {};
        }

        // @ts-ignore
        dto.result = true;

        res.type('application/json');

        return res.status(200).json(dto);

    }

    public false<T>(res: express.Response, dto?: T) {

        if (!dto) { // @ts-ignore
            dto = {};
        }

        // @ts-ignore
        dto.result = false;

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
