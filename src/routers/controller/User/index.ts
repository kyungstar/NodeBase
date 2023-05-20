import {Router} from "express";
import Config from "../../../../config";

import UserController from './UserController'
import {jwtAuthCheck} from "../../../middlewares/JwtAuth";

const router = Router();


// 이메일 중복검사 ✓
router.post("/user/email/check", UserController.userEmail)

// 전화번호 중복검사 ✓
router.post("/user/phone/check", UserController.userPhone)

// 회원가입 ✓
router.post("/user/join", UserController.userJoin)

// 고객 로그인 ✓
router.post("/user/login", UserController.userLogin)

// 인증발송 API ✓
router.post("/send/auth", UserController.sendAuth)

// 인증하기 ✓
router.post("/user/auth", UserController.userAuth)

// 비밀번호 인증 ✓
router.post("/user/password/auth", UserController.authPw)

// 비밀번호 변경하기 ✓
router.post("/user/password", [jwtAuthCheck], UserController.resetPw)



export default router;