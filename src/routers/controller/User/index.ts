import {Router} from "express";
import Config from "../../../../config";

import UserController from './UserController'

const router = Router();


// 이메일 중복검사
router.post("/user/email/check", UserController.userEmail)

// 핸드폰 중복검사
router.post("/user/phone/check", UserController.userPhone)

// 회원가입
router.post("/user/join", UserController.userJoin)


export default router;