import { Request, Response, NextFunction } from 'express';
import Mongo from "../modules/Mongo";
import Logger from "../modules/Logger";



const logger = async (req: Request, res: Response, next: NextFunction) => {
    const {method, url, body, query, params} = req;
    const { statusCode, statusMessage } = res; // 추가: 응답 데이터를 가져옴
    const headers = res.getHeaders(); // 수정: res.getHeaders()를 사용하여 헤더 가져오기

    const db = await Mongo(); // db 값을 가져옴


    if (!db) {
        throw new Error('DB connection is not available');
    }

    const collection = db.collection('log_reply_user');

    const log = {
        method,
        url,
        body,
        query,
        params,
        response: { // 추가: 응답 데이터를 로그에 추가
            statusCode,
            statusMessage,
            headers,
            data: res.locals.data
        },
        timestamp: new Date(),
    };

    const result = await collection.insertOne(log);

    let mongoResult = result.acknowledged;

    if(mongoResult === true)
        Logger.info('API log saved to MongoDB');
    else
        Logger.error(mongoResult);

    next();


};


export default logger;
