

const crypto = require("crypto");
const escape = require('mysql').escape;
const moment = require('moment');

import Config from "../../config";
import ResultBox from "../routers/dto/ResultBox";
import Logger from "../modules/Logger";

export default class SecurityAuth extends ResultBox {


    public static async getEncryptPwd(pwd: string) {

        try {

            // 문자열을 바이트 배열로 변환
            const byteArr = Buffer.from(Config.ENCRYPT.ENCRYPT_KEY, 'utf-8');

            // 바이트 배열을 16진수 문자열로 변환
            const salt = byteArr.toString('hex');

            const iterations = Config.ENCRYPT.ITERATIONS; // 반복 횟수
            const keyLength = Config.ENCRYPT.KEY_LENGTH; // 생성될 키의 길이
            const digest = Config.ENCRYPT.DIGEST; // 해시 알고리즘

            const derivedKey = crypto.pbkdf2Sync(pwd, salt, iterations, keyLength, digest);
            const encryptedPassword = derivedKey.toString('hex');

            return encryptedPassword;

        } catch (err) {
            return this.JustErr(err);
        }
    }


}

