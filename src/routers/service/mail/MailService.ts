import ResController from "../../controller/ResController";
import Config from "../../../../config"
import UserService from "../user/UserService";
import ResultBox from "../../dto/ResultBox";

const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service: 'Naver',   // 메일 보내는 곳
    port: 587,
    host: 'smtp.naver.com',
    secure: false,
    requireTLS: true,
    auth: {
        user: Config.SMTP.user_email,  // 보내는 메일의 주소
        pass: Config.SMTP.user_passwd   // 보내는 메일의 비밀번호
    }
})


function getMailTitle(authType: string) {

    let title;

    if(authType === 'FIND_PW')
        title = '고객님의 비밀번호 안내입니다.';
    else if(authType === 'FIND_ID')
        title = '고객님의 아이디 안내입니다.';

    return title;
}

export default class MailService extends ResultBox {


    public static async send(targetMail: string, title: string, contents: string) {
        try {

            // 메일 옵션
            let mailOptions = {
                from: Config.SMTP.user_email, // 보내는 메일의 주소
                to: targetMail, // 수신할 이메일
                subject: title, // 메일 제목
                text: contents // 메일 내용
            };

            // 메일 발송
            let result = await transporter.sendMail(mailOptions);

            if(!result)
                return null;

            let resultObj = {
                accepted: result.accepted,
                rejected: result.rejected
            }

            return resultObj;

        } catch (err) {
            return null;
        }
    }

    public static async authEmail(authType: string, loginId: string, email: string) {
        try {

            let userData;

            // 비밀번호 찾기는, 아이디를 기반으로 진행된다.
            if(authType === 'FIND_PW')
                userData = await UserService.getUserDataByLoginId(loginId);

            // 아이디 찾기는, 고객의 이메일을 기반으로 진행된다.
            else if(authType === 'FIND_ID')
                userData = await UserService.getUserDataByEmail(email);

            if (!userData)
                return this.JustFalse('NU0');

            const userAuthData = await UserService.getUserAuthData(userData.user_id, authType);

            let mailOptions = {
                from: Config.SMTP.user_email, // 보내는 메일의 주소
                to: userData.email, // 수신할 이메일
                subject: getMailTitle(authType), // 메일 제목
                text: userAuthData.contents // 메일 내용
            };

            let sendEmailResult = await transporter.sendMail(mailOptions);

            if (sendEmailResult.accepted.includes(userData.email))
                return this.JustTrue('01');
            else
                return this.JustFalse('01');

        } catch (err) {
            return null;
        }
    }

}

