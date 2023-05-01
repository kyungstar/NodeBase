/**
 * Make By KYG On 2023-04-16
 * LOG LEVEL
 error: 0 , warn: 1 , info: 2 , http: 3 , verbose: 4 , debug: 5 , silly: 6
 */


import Winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';

import Config from '../../Config';

class Logger {


    constructor() {

        const format = Winston.format.combine(
            Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
            Winston.format.printf(
                (info) => `${info.timestamp} ${info.level} : ${info.message}`,
            ),
        )

        this.option = {
            format,
            level: Config.LOG.LEVEL,
            transports: [
                new WinstonDaily({
                    level: Config.LOG.LEVEL,
                    datePattern: 'YYYYMMDD',
                    dirname: Config.LOG.LOG_PATH,
                    filename: Config.SERVER_TYPE + "_%DATE%.log",
                    maxSize: Config.LOG.FILE_SIZE,
                    maxFiles: Config.LOG.FILE_CNT,
                }),

                new Winston.transports.Console({
                    handleExceptions: true,
                })
            ]
        };

        this.LogLoader = Winston.createLogger(this.option);
    }

    // 저장된 옵션에 대해 Winston.LoggerOptions으로 사용한다.
    private option: Winston.LoggerOptions;
    // 옵션이 적용된 LoggerLoader를 실행하기 위해 정의한다.
    public LogLoader: Winston.Logger;


}

const logger = new Logger();

export default logger.LogLoader;