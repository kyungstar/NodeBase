
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
    DFS = "DFS"
}

class Config {

    // Global
    PORT: number;
    DOCS_PORT: number;
    SERVER_TYPE: string;
    DEFAULT_FILE_PATH: string;
    OS_TYPE: string;
    FILE_SIZE: number;
    MQTT_HOST: string;
    MONGO_URL: string;

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
        port: number;
        user: string;
        password: string;
        database: string;
        connectionLimit: string;
        encrypt_key: string;
        entity_path: string;
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

    ENCRYPT: {
        ITERATIONS: number;
        KEY_LENGTH: number;
        DIGEST: string;
        ENCRYPT_KEY: string;
    }

    constructor() {

        // Global
        this.PORT = parseInt(process.env.PORT, 10);
        this.DOCS_PORT = parseInt(process.env.DOCS_PORT, 10);
        this.MQTT_HOST = process.env.MQTT_HOST;
        this.MONGO_URL = process.env.MONGO_URL;
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
            port: parseInt(process.env.DB_PORT, 10),
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            connectionLimit: process.env.connectionLimit,
            encrypt_key: process.env.ENCRYPT_KEY,
            entity_path: process.env.ENTITY_PATH
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

        this.ENCRYPT = {
            ITERATIONS: parseInt(process.env.ITERATIONS),
            KEY_LENGTH: parseInt(process.env.KEY_LENGTH),
            DIGEST: process.env.DIGEST,
            ENCRYPT_KEY: process.env.ENCRYPT_KEY
        }

    }
}

export default new Config();