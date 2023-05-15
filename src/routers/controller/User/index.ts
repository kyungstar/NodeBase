import {Router} from "express";
import Config from "../../../../config";

import UserController from './UserController'

const router = Router();


// 이메일 중복검사 🆗
router.post("/user/email/check", UserController.userEmail)

// 전화번호 중복검사 > 전화번호 CONVERT
/*
 SELECT *
FROM t_node_user
WHERE CONVERT(AES_DECRYPT(UNHEX(phone_number), ${escape(config_1.default.DB.encrypt_key)}) USING utf8) = ${escape(phoneNumber)}

 */
router.post("/user/phone/check", UserController.userPhone)

// 회원가입
router.post("/user/join", UserController.userJoin)

// 고객 로그인
router.post("/user/login", UserController.userLogin)



// 인증발송 API
router.post("/send/auth", UserController.sendAuth)

// 인증하기
router.post("/user/auth", UserController.userAuth)

// 비밀번호 변경하기
router.post("/user/password", UserController.resetPw)

// 고객정보 변경하기
router.post("/user/update", UserController.updateUser)

export default router;