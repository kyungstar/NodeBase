import { MongoClient } from 'mongodb';
import Config from "../../config";
import Logger from "./Logger";


export default async () => {

    try {
        const client = await MongoClient.connect(Config.MONGO_URL);
        const dbName = 'mongo_base_log'; // 데이터베이스 이름

        const db = client.db(dbName);

        Logger.info("Mongo Loading Success");

        return db;


    } catch (err) {
        Logger.error("Mongo Loading is Fail" + err);
    }
}
