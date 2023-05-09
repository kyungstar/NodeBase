
import dotenv from "dotenv";
import path from "path";

process.env.ROOT_PATH = path.join(__dirname, "..");

let envFound = dotenv.config({path: __dirname + "/.env." + process.argv[2].toLowerCase()});

if (envFound.error) {
    // 설정 로드 못함. 실행 실패
    throw new Error("Couldn't find .env file");
}

export enum ServerEnum {
    WAS = "WAS",
}

class Config {

    // Global
    PORT: number;
    SERVER_TYPE: string;
    DEFAULT_FILE_PATH: string;
    OS_TYPE: string;
    FILE_SIZE: number;

    //JWT
    JWT: {
        SECRET: string,
        EXPIRES_IN: string
    };

    SMTP: {
        user_email: string;
        user_passwd: string;
    }


    DB: {
        host: string;
        port: string;
        user: string;
        password: string;
        database: string;
        connectionLimit: string;
        encrypt_key: string
    }

    SMS: {
        URL: string;
        MERCHANT_KEY: string;
    }

    LOG: {
        LOG_PATH: string;
        LEVEL: string;
        FILE_SIZE: string;
        FILE_CNT: string;
    }


    constructor() {

        // Global
        this.PORT = parseInt(process.env.PORT, 10);
        this.SERVER_TYPE = process.env.SERVER_TYPE
        this.DEFAULT_FILE_PATH = process.env.DEFAULT_FILE_PATH
        this.FILE_SIZE = parseInt(process.env.FILE_SIZE);

        this.JWT = {
            SECRET: process.env.JWT_SECRET,
            EXPIRES_IN: process.env.JWT_EXPIRES_IN
        };

        this.SMTP = {
            user_email: process.env.USER_EMAIL,
            user_passwd: process.env.USER_PASSWD
        };

        this.DB = {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            connectionLimit: process.env.connectionLimit,
            encrypt_key: process.env.ENCRYPT_KEY
        }

        this.SMS = {
            URL: process.env.URL,
            MERCHANT_KEY: process.env.MERCHANT_KEY
        }

        this.LOG = {
            LOG_PATH: process.env.LOG_PATH,
            LEVEL: process.env.LEVEL,
            FILE_SIZE: process.env.FILE_SIZE,
            FILE_CNT: process.env.FILE_CNT
        }

    }
}

export default new Config();