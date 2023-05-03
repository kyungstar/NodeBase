import {json, Request, Response} from "express";
import ResController from '../ResController';
import MailService from '../../../routers/service/mail/MailService'
import DataChecker from "../../util/DataChecker";

class MailController extends ResController {

    public send = async (req: Request, res: Response) => {
        let data = DataChecker.mergeObject(
            DataChecker.loadJWTUserCheck(res, req.body),
            DataChecker.needArrCheck(res, req.body, ["targetMail", "title", "contents"])
        ) as {
            targetMail: string,
            title: string,
            contents: string
        };

        let result = await MailService.send(data.targetMail, data.title, data.contents);

        if(result)
            return this.true(res, 'MS0', {
                accepted: result.accepted,
                rejected: result.rejected
            });
        else
            return this.false(res, 'MF0')

    }

}

export default new MailController();