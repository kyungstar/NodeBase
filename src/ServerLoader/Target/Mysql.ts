
import DB from "../../modules/Mysql";
import Config from "../../../config"
import Logger from "../../modules/Logger";


export default async () => {

    try {

        await DB.getCluster().add("master", {
            host: Config.DB.host,
            port: Config.DB.port,
            user: Config.DB.user,
            password: Config.DB.password,
            database: Config.DB.database,
            multipleStatements: true,
            connectionLimit: Config.DB.connectionLimit,
            collation: "utf8mb4_general_ci",
            acquireTimeout: 10000,
            dateStrings: true,
            timezone: "Asia/Seoul"
        });

        return;

    } catch(err) {
        throw new Error(err);
    }
}

