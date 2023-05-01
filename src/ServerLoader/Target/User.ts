import express from "express";
import {AddressInfo} from "net";
import formData from "express-form-data";
const app = express();

import Config from "../../../config";
import Logger from "../../../src/modules/Logger";

import router from "../../routers/controller";


export default async () => {


    // JSON 파싱 미들웨어를 사용하고, 요청 본문의 크기를 제한합니다.
    app.use(express.json({limit: '50mb'}));

    // URL-encoded 파싱 미들웨어를 사용하고, 요청 본문의 크기를 제한합니다.
    app.use(express.urlencoded({limit: '50mb'}));

    // 프록시 서버에서 X-Forwarded-For 헤더를 신뢰하도록 설정합니다.
    app.enable('trust proxy');


    //파일 업로드를 위해 요청 본문을 파싱하는 미들웨어를 등록하고, 설정을 지정합니다.
    app.use(formData.parse({
        uploadDir: Config.DEFAULT_TEMP_FILE_PATH, // 업로드 된 파일을 저장할 디렉토리를 설정
        autoClean: true, // 요청이 완료된 후 임시 파일을 자동으로 삭제
        maxFilesSize: 1024 * 1024 * 1024, // 전송되는 파일의 최대 크기를 설정
    }));


    // 파일 업로드를 위한 미들웨어를 등록합니다.
    // 미들웨어와 함께 사용되며, 다중 파일 업로드를 지원하기 위해 사용됩니다. 이 미들웨어는 파싱된 파일들을 하나의 객체로 병합하여 req.body에 저장합니다.
    app.use(formData.union());

    app.get("/", (req, res) => {
        res.send("Hello, world!");
    });

    app.use("/", router);


    const server = app.listen(Config.PORT, () => {
        const {address, port} = server.address() as AddressInfo;
        Logger.info(Config.SERVER_TYPE + ' Server on ' + 'http://127.0.0.1:' + port)
    });

}