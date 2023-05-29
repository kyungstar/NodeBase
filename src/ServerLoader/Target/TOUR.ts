import express from "express";
import {AddressInfo} from "net";
import formData from "express-form-data";

import Config from "../../../Config";
import router from "../../Routers/Controller";
import Logger from "../../modules/Logger";
import cookieParser from "cookie-parser";

const app = express();

export default async () => {

    // JSON 파싱 미들웨어를 사용하고, 요청 본문의 크기를 제한합니다.
    app.use(express.json({limit: '50mb'}));

    app.get('/', (req, res) => res.status(200).end());
    app.head('/', (req, res) => res.status(200).end());

    // 프록시 서버에서 X-Forwarded-For 헤더를 신뢰하도록 설정합니다.
    app.enable('trust proxy');

    // 미들웨어를 사용하면 쿠키를 파싱하는 로직을 개발자가 구현할 필요 없이, req.cookies 객체를 통해 간편하게 쿠키 값을 가져올 수 있습니다.
    app.use(cookieParser());

    app.use("/", router);

    const server = app.listen(Config.PORT, () => {
        const {address, port} = server.address() as AddressInfo;
        Logger.info(Config.SERVER_TYPE + ' Server on ' + 'http://127.0.0.1:' + port)
    });


}