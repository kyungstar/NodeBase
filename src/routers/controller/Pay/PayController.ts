import {Request, Response} from "express";
import ResController from '../ResController';

import PayService from "../../service/pay/PayService"
import DataChecker from "../../../routers/util/DataChecker";

class PayController extends ResController {

    // 결제 데이터 저장
    public ready = async (req: Request, res: Response) => {
        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, ['phone']),
          //  DataChecker.loadJWTValue(req.body),
          //  DataChecker.loadJWTUserCheck(res, req.body)
        ) as {
            userId: string,
            phone: string
        };

        let result = await PayService.ready(data.userId, data.phone);

        if(result)
            return this.true(res, 'PRS0', {paySeq: result.insertId})
        else
            return this.false(res, 'PRF0')
    }


    // 결제 취소
    public cancel = async (req: Request, res: Response) => {
        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, ['paySeq'])
        ) as {
            paySeq: string
        };


    }

    // 문자 결제
    public sms = async (req: Request, res: Response) => {
        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, [
                 'ordNm', 'ordHpNo', 'goodsNm', 'goodsAmt', 'mid', 'usrId', 'sid'])
        ) as {
            ordNm: string,
            ordHpNo: string,
            mid: string,
            usrId: string,
            sid: string,
            goodsNm: string,
            goodsAmt: number
        };


        // sms 결제 준비
        let result = await PayService.smsPay(res, data.ordNm, data.ordHpNo, data.mid, data.usrId, data.sid, data.goodsNm, data.goodsAmt);

        // result 결제 준비 처리 필요함

        if(result)
            return this.true(res, 'SC1');
        else
            return this.false(res, 'SF1')

    }


    // 문자 결제 내역 조회
    public smsResult = async (req: Request, res: Response) => {
        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, ['mid', 'usrId', 'sid', 'reqId'])
        ) as {
            reqId: string,
            mid: string,
            usrId: string,
            sid: string,
        };

        // sms 결제 내역 조회
        let result = await PayService.smsPayResult(res, data.mid, data.usrId, data.sid, data.reqId);

        if(result)
            return this.true(res, 'S01', {result: result});
        else
            return this.false(res, 'S01')

    }


}

export default new PayController();