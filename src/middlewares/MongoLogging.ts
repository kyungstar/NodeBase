import { Request, Response, NextFunction } from 'express';
import Mongo from "../modules/Mongo";



const logger = async (req: Request, res: Response, next: NextFunction) => {
    const {method, url, body, query, params} = req;

    const db = await Mongo(); // db 값을 가져옴


    if (!db) {
        throw new Error('DB connection is not available');
    }


    const collection = db.collection('mongo_base_log');

    const log = {
        method,
        url,
        body,
        query,
        params,
        timestamp: new Date(),
    };

    const result = await collection.insertOne(log);

    let mongoResult = result.acknowledged;

    if(mongoResult === true)
        console.log('API log saved to MongoDB');
    else
        console.error(mongoResult);

    next();


};


export default logger;
