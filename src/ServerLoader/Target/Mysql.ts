import { createConnection, ConnectionOptions } from 'typeorm';
import { join } from 'path';
import Config from "../../../config"
import DB from "../../modules/Mysql";
import Logger from "../../modules/Logger";
import {User, UserLogin} from "../../routers/entities/User/UserEntity";

export default async () => {
    try {
        const connectionOptions: ConnectionOptions = {
            type: 'mysql',
            host: Config.DB.host,
            port: Config.DB.port,
            username: Config.DB.user,
            password: Config.DB.password,
            database: Config.DB.database,
            entities: [User, UserLogin],
            synchronize: true,
        };

        return await createConnection(connectionOptions);

    } catch (err) {
        throw new Error(err);

    }
}


