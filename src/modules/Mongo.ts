import { MongoClient } from 'mongodb';
import Config from "../../config";
import Logger from "./Logger";


export default async () => {

    try {
        /**
         1. MongoDB Docker 이미지 가져오기.
         > docker pull mongo

         2. MongoDB 컨테이너 실행
         > docker run -d -p 18184:18184 --name mongodb mongo

         3. MongoDB 컨테이너 상태 확인
         > docker ps

         4. docker-container의 이름으로 mongo를 실행시킨다.
         > local 16751 포트를, docker-container의 27017 포트에 맵핑한다.
         docker run -d -p 16751:27017 --name mongo-container mongo
         */

        const client = await MongoClient.connect(Config.MONGO_URL);
        const dbName = 'mongo_base_log'; // 데이터베이스 이름

        const db = client.db(dbName);

        Logger.info("Mongo Loading Success");

        return db;


    } catch (err) {
        Logger.error("Mongo Loading is Fail" + err);
    }
}
