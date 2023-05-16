import Config from "../../../../config"
import DB from "../../../modules/Mysql";
import QM from "../../../modules/QueryMaker";
import ResultBox from '../../dto/ResultBox'
import {User, UserLogin} from '../../entities/User/UserEntity';


import Logger from "../../../modules/Logger";
import {createToken, JwtModel} from "../../../middlewares/JwtAuth";
import {getRepository, getConnection, createConnection} from "typeorm";
import MailService from "../mail/MailService";
import {AES} from "crypto-js";


const escape = require('mysql').escape;
const moment = require('moment');


const crypto = require("crypto");

export default class PayService extends ResultBox {


    public static async checkUserAuth(loginId: string, authType: string, authPwd: string) {

        try {

            const authData = await DB.getOne(QM.Select("t_node_login", {
                auth_type: authType,
                auth_pwd: authPwd,
                login_id: loginId,
                auth_expire_date: '\\> NOW()'
            }, ["*"]));

            if (!authData)
                return false;

            const isAuth = authType === 'USER_JOIN' ? '0' : 1;

            let result = await DB.Executer(QM.Update("t_node_login", {
                initial_auth: 1,
                is_auth: 0,
            }, {
                login_id: loginId
            }));

            if (result)
                return true;
            else
                return false;

        } catch (err) {
            Logger.error(err + ' Is Occurred');
            return false;
        }
    }


    public static async phoneCheck(phoneNumber: string) {

        try {

            const userRepository = getRepository(User);

// 검색된 사용자를 출력하거나 원하는 처리를 수행
            const searchUserData = await userRepository
                .createQueryBuilder('user')
                .where(`CONVERT(AES_DECRYPT(UNHEX(phone_number), '${Config.DB.encrypt_key}') USING utf8)`, {
                    phone_number: phoneNumber,
                })
                .getOne();

            console.log(searchUserData);

        } catch (err) {
            Logger.debug(err + ' is Occured')
            return false;
        }
    }


    public static async emailCheck(email: string) {

        try {

            // email 컬럼 검색
            const userRepository = getRepository(User);

            // 검색된 사용자를 출력하거나 원하는 처리를 수행
            const searchUserData = await userRepository.findOne({ where: { email: email } });

            if(searchUserData)
                return ResultBox.JustFalse('01');
            else
                return ResultBox.JustTrue('01');

        } catch (err) {
            return ResultBox.JustErr(err);
        }
    }


    public static async Join(loginId: string, pwd: string, userType: string, email: string, name: string, nickName: string,
                             phoneNumber: string, gender: string, address: string, addressDetail: string) {

        const queryRunner = getConnection().createQueryRunner();


        try {

            let userId = Math.random().toString(36).substring(7, 25);
            let newPwd: string = "";

            for (let i = 0; i < 6; i++) {
                const rnum = Math.floor(Math.random() * pwd.length);
                newPwd += pwd.substring(rnum, rnum + 1)
            }


            await queryRunner.connect();
            await queryRunner.startTransaction();

            // 사용자를 데이터베이스에 삽입하는 작업
            const user = new User();
            const userLogin = new UserLogin();

            // 유저 베이스
            user.user_id = userId;
            user.name = name;
            user.email = email;
            user.phoneNumber = phoneNumber;
            user.gender = gender;
            user.address = address;
            user.addressDetail = addressDetail;

            // 유저 로그인정보
            userLogin.user_id = userId;
            userLogin.loginId = loginId;
            userLogin.pwd = pwd;
            userLogin.tryCount = 0;
            userLogin.initialAuth = 0;
            userLogin.isAuth = 0;
            userLogin.authType = 'USER_JOIN';
            userLogin.authPwd = newPwd;
            userLogin.authExpireDate = moment().format('YYYY-MM-DD HH:MM');

            let result = await queryRunner.manager.save([user, userLogin]);

            if(result) {

                // 회원가입 실패시
                const mailResult = await MailService.authEmail(email, 'USER_JOIN', '인증번호는 ' + newPwd + ' 입니다.');

                if (mailResult.accepted[0].includes(email)) {

                    await queryRunner.commitTransaction();
                    await queryRunner.release();
                    return ResultBox.JustTrue('01');
                } else {
                    await queryRunner.rollbackTransaction();
                    await queryRunner.release();
                    return ResultBox.JustFalse('02');
                }

            } else {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
                return ResultBox.JustFalse('01');
            }



        } catch (err) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            return err;
        }
    }


    public static async Access(res: any, loginId: string, pwd: string) {

        try {

            const userRepository = getRepository(User);

            const newUser = new User();
            newUser.name = 'John Doe';
            newUser.email = 'john@example.com';

            await userRepository.save(newUser);
            console.log('사용자 생성 완료');
            /*let userData = await DB.getOne(QM.Select("t_node_user", {
                login_id: loginId
            }, ["*"]));
             if (!userData)
                return null;
*/


            let loginData = await DB.getOne(QM.Select("t_node_login", {
                login_id: loginId
            }, ["*"]));

            // 로그인정보 존재하지 않음.
            if (!loginData)
                return {result: false, message: 'NL0'};

            if (loginData.initial_auth === 0 || loginData.try_cnt === 3 || loginData.try_cnt > 3) {
                Logger.info(loginData.initial_auth, 'loginData');
                Logger.info(loginData.try_cnt, 'loginData');
                Logger.info(loginData.initial_auth, 'loginData');
                return {result: false, message: 'PT0'};
            }

            // todo 트랜잭션 처리 필요함.
            // 비밀번호 불일치
            if (pwd !== loginData.pwd) {

                let result = await DB.Executer(QM.Update("t_node_login", {try_cnt: '\\try_cnt + 1'}, {user_id: loginData.user_id}))

                if (result)
                    return {result: false, code: 'USO'};
                else
                    return {result: false, code: 'USO'};

            }

            let result = await DB.Executer(QM.Update("t_node_login", {try_cnt: 0}, {user_id: loginData.user_id}))

            /*  if (result) {
                  const token = createToken(new JwtModel(({u: userData.user_id, t: userData.user_type} as JwtModel)));

                  return token;
              } else {
                  return false;
              }*/


        } catch (err) {
            return err;
        }
    }

    public static async getUserAuthData(loginId: string, authType: string) {

        try {

            let pwd = moment().format('YYYYMMDD') + loginId + moment().format('DDD');
            let newPwd: string = "";

            for (let i = 0; i < 6; i++) {
                const rnum = Math.floor(Math.random() * pwd.length);
                newPwd += pwd.substring(rnum, rnum + 1)
            }


            let result = await DB.Executer(QM.Update("t_node_login", {
                auth_pwd: newPwd,
                auth_expire_date: '\\NOW() + INTERVAL 3 MINUTE'
            }, {login_id: loginId}));

            if (!result)
                return false;

            if (authType === 'FIND_ID') {
                return {contents: '[휴먼계정 해제] 고객님의 메일 인증 비밀번호는 ' + newPwd + '입니다.'}
            } else {
                return {contents: '고객님의 메일 인증 비밀번호는 ' + newPwd + '입니다.'}
            }


        } catch (err) {
            Logger.error(err + ' is Occurred')
            return err;
        }

    }

    public static async getUserData(loginId: string) {

        try {

            let loginData = await DB.getOne(QM.Select("t_node_user", {
                login_id: loginId
            }, ["*"]));

            if (!loginData && !loginData.email)
                return false;
            else
                return loginData;

        } catch (err) {
            return err;
        }
    }

    public static async getUserLoginData(loginId: string) {

        try {


            let loginData = await DB.getOne(QM.Select("t_node_login", {
                login_id: loginId
            }, ["*"]));

            if (loginData)
                return loginData;
            else
                return false;

        } catch (err) {
            return err;
        }
    }

    public static async updatePwd(loginId: string, originPwd: string, newPwd: string) {

        try {


            let loginData = await this.getUserLoginData(loginId);

            if (!loginData)
                return {result: false, code: 'NEU'}


            if (originPwd !== loginData.pwd)
                return {result: false, code: 'OPN'}


            let result = await DB.Executer(QM.Update("t_node_login", {
                pwd: newPwd
            }, {
                login_id: loginId
            }))

            if (result)
                return ResultBox.JustTrue('01');
            else
                return ResultBox.JustFalse('01');


        } catch (err) {
            return ResultBox.JustErr(err)
        }
    }


    public static async updateUser(loginId: string, email: string, phoneNumber: string, address: string, addressDetail: string) {

        try {

            let result = await DB.Executer(QM.Update("t_node_user", {
                email: email,
                phone_number: phoneNumber,
                address: address,
                address_detail: addressDetail,
            }, {
                login_id: loginId
            }))

            return result;

        } catch (err) {
            return err;
        }
    }


    public static async black(targetUserId: string, status: string) {

        try {

            let result = await DB.Executer(QM.Update("t_node_user", {
                status: status,
            }, {
                user_id: targetUserId
            }))

            return result;


        } catch (err) {
            return err;
        }
    }

    public static async warn(targetUserId: string) {

        try {

            let result = await DB.Executer(QM.Update("t_node_user", {
                warn: '\\warn + 1',
            }, {
                user_id: targetUserId
            }))

            let userData = await DB.getOne(QM.Select("t_node_user", {
                user_id: targetUserId
            }, ["*"]));

            if (userData.warn === 5)
                return userData;

            return result;


        } catch (err) {
            return err;
        }
    }


}
