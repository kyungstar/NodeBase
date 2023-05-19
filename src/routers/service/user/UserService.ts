//import UtilController from "../../controller/UtilController";
import Config from "../../../../config"
import DB from "../../../modules/Mysql";
import QM from "../../../modules/QueryMaker";
import MailService from "../mail/MailService";
import ResController from "../../controller/ResController";
import Logger from "../../../modules/Logger";
import {createToken, JwtModel} from "../../../middlewares/JwtAuth";
import ResultBox from "../../dto/ResultBox";


const escape = require('mysql').escape;
const moment = require('moment');


const crypto = require("crypto");

export default class UserService extends ResultBox {


    public static async checkUserAuth(loginId: string, authType: string, authPwd: string) {

        try {

            const authData = await DB.getOne(QM.Select("t_node_login", {
                auth_type: authType,
                auth_pwd: authPwd,
                login_id: loginId,
                auth_expire_date: '\\> NOW()'
            }, {}, ["*"]));

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

            let result = await DB.getOne(QM.Select("t_node_user", {}, {
                phone_number: phoneNumber
            }, ["*"]));

            if (result)
                return this.JustFalse('P01');
            else
                return this.JustTrue('P01');

        } catch (err) {
            Logger.debug(err + ' is Occured')
            return false;
        }
    }


    public static async emailCheck(email: string) {

        try {

            let result = await DB.getOne(QM.Select("t_node_user", {
                email: email
            }, {}, ["*"]))

            if (result)
                return this.JustFalse('E01');
            else
                return this.JustTrue('E01')

        } catch (err) {
            Logger.debug(err + ' is Occured')
            return false;
        }
    }


    public static async Join(loginId: string, pwd: string, userType: string, email: string
        , name: string, nickName: string, phoneNumber: string, gender: string, address: string, addressDetail: string) {

        try {


            // 전화번호 중복 검증
            let phoneCheck = await this.phoneCheck(phoneNumber);

            if (!phoneCheck)
                throw 'P01';

            // 이메일 중복 검증
            let emailCheck = await this.emailCheck(email);

            if (!emailCheck)
                throw 'E01';

            let userId = Math.random().toString(36).substring(7, 25);
            let newPwd: string = "";

            for (let i = 0; i < 6; i++) {
                const rnum = Math.floor(Math.random() * pwd.length);
                newPwd += pwd.substring(rnum, rnum + 1)
            }


            // todo 암호화 변경
            await DB.get([
                QM.Insert("t_node_user", {
                    user_id: userId,
                    login_id: loginId,
                    user_type: userType,
                    email: email,
                    user_name: '\\(HEX(AES_ENCRYPT(' + escape(name) + ', ' + escape(Config.DB.encrypt_key) + ')))',
                    nickname: nickName,
                    phone_number: '\\(HEX(AES_ENCRYPT(' + escape(phoneNumber) + ', ' + escape(Config.DB.encrypt_key) + ')))',
                    gender: gender,
                    address: address,
                    address_detail: addressDetail,
                    status: 50
                }),
                QM.Insert("t_node_login", {
                    user_id: userId,
                    login_id: loginId,
                    pwd: crypto.createHash('sha512').update(pwd).digest('hex'),
                    auth_type: 'USER_JOIN',
                    auth_pwd: newPwd,
                    auth_expire_date: '\\NOW() + INTERVAL 3 MINUTE',
                    reg_date: '\\NOW()'
                })
            ])

            const contents = '고객님의 메일 인증 비밀번호는 ' + newPwd + '입니다.'

            let sendEmailResult = await MailService.send(email, '회원가입 인증코드입니다.', contents);

            if (sendEmailResult.accepted.includes(email))
                return true;
            else
                return false;

        } catch (err) {
            return this.JustErr(err);
        }
    }


    public static async Access(res: any, loginId: string, pwd: string) {

        try {

            let userData = await DB.getOne(QM.Select("t_node_user", {
                login_id: loginId
            }, {},["*"]));

            if (!userData)
                return this.JustFalse('NU0');

            let loginData = await DB.getOne(QM.Select("t_node_login", {
                login_id: loginId
            }, {}, ["*"]));

            // 로그인정보 존재하지 않음.
            if (!loginData)
                return this.JustFalse('NL0')

            if (loginData.initial_auth === 0 || loginData.try_cnt === 3 || loginData.try_cnt > 3) {
                return this.JustFalse('PT0')
            }


            // todo 트랜잭션 처리 필요함.
            // 비밀번호 불일치
            if (pwd !== loginData.pwd) {

                console.log(loginData);

                let result = await DB.Executer(QM.Update("t_node_login", {try_cnt: '\\try_cnt + 1'}, {user_id: loginData.user_id}))

                if(result)
                    return this.JustFalse('IP0')
                else
                    return this.JustErr('99');

            }

            let result = await DB.Executer(QM.Update("t_node_login", {try_cnt: 0}, {user_id: loginData.user_id}))

            if (result) {
                const token = createToken(new JwtModel(({u: userData.user_id, t: userData.user_type} as JwtModel)));

                return this.JustTrue('01');
            } else {
                return this.JustFalse('01');
            }


        } catch (err) {
            return this.JustErr(err);
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


        } catch
            (err) {
            Logger.error(err + ' is Occurred')
            return err;
        }

    }

    public static async getUserData(loginId: string) {

        try {

            let loginData = await DB.getOne(QM.Select("t_node_user", {
                login_id: loginId
            }, ["*"], []));

            if (!loginData && !loginData.email)
                return false;
            else
                return loginData;

        } catch (err) {
            return err;
        }
    }

    public static async updatePwd(loginId: string, newPwd: string) {

        try {


            let result = await DB.Executer(QM.Update("t_node_login", {
                pwd: crypto.createHash('sha512').update(newPwd).digest('hex')
            }, {
                login_id: loginId
            }))

            return result;


        } catch
            (err) {
            return err;
        }
    }


    public static async updateUser(loginId: string, email: string, phoneNumber: string, address: string, addressDetail: string, zipCode: string) {

        try {

            let result = await DB.Executer(QM.Update("t_node_user", {
                email: email,
                phone_number: phoneNumber,
                address: address,
                address_detail: addressDetail,
                zip_code: zipCode
            }, {
                login_id: loginId
            }))

            return result;


        } catch (err) {
            return err;
        }
    }

}

