import { MongoClient } from 'mongodb';
import Config from "../../../config";
import Logger from "../../modules/Logger";
import express from "express";

const app = express();

export default async () => {
    const dbName = 't_nosql_log'; // 데이터베이스 이름

    try {
        const client = await MongoClient.connect(Config.MONGO_URL);
        const db = client.db(dbName);
        app.locals.db = db; // Express 애플리케이션에서 db 변수를 사용할 수 있도록 설정

        Logger.info("Mongo Loading Success");

    } catch (err) {
        Logger.error("Mongo Loading is Fail" + err);
    }
}
