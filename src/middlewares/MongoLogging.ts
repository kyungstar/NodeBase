import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction) => {
    const { method, url, body, query, params } = req;
    const db = req.app.locals.db; // db 변수 가져오기

    if (!db) {
        throw new Error('DB connection is not available');
    }

    const collection = db.collection('api_logs');


    const log = {
        method,
        url,
        body,
        query,
        params,
        timestamp: new Date(),
    };

    collection.insertOne(log)
        .then(() => {
            console.log('API log saved to MongoDB');
            next();
        })
        .catch((err: Error) => {
            console.error('Failed to save API log:', err);
            next();
        });
};

export default logger;
