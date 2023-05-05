import {Router} from "express";
import Config from "../../../../config";

import PayController from './PayController'

const router = Router();


// 결제전 서버저장
router.post("/pay/ready", PayController.ready)

// 결제전 문자 결제 요청하기
router.post("/pay/sms", PayController.sms)

// 결제정보 저장하기
router.post("/pay/sms/result", PayController.smsResult)


export default router;