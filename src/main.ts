
import Config from "../config";

import UserLoader from "./ServerLoader/Target/User";
import DFSLoader from "./ServerLoader/Target/DFS";
import DBLoader from "./ServerLoader/Target/Mysql";
import MQTTLoader from "./ServerLoader/Target/MQTT";
import TOURLoader from "./ServerLoader/Target/TOUR";

import Logger from ".//modules/Logger";
import MQTT from "./ServerLoader/Target/MQTT";

(async function () {

    // 고객
    if (["USER"].indexOf(Config.SERVER_TYPE) >= 0) {
        Logger.info(Config.SERVER_TYPE + ' Is Loading')
        Logger.info('DB Is Loading')
        await DBLoader();
        await UserLoader();
    }

    // 파일
    if (["DFS"].indexOf(Config.SERVER_TYPE) >= 0) {
        Logger.info(Config.SERVER_TYPE + ' Is Loading')
        Logger.info('DataBase is Loading')
        await DBLoader();
        await DFSLoader();
    }

    // MQTT Messaging Protocol
    if (["MQTT"].indexOf(Config.SERVER_TYPE) >= 0) {
        Logger.info(Config.SERVER_TYPE + ' Is Loading')
        await MQTTLoader();
    }

    // MQTT Messaging Protocol
    if (["TOUR"].indexOf(Config.SERVER_TYPE) >= 0) {
        Logger.info(Config.SERVER_TYPE + ' Is Loading')
        await TOURLoader();
        await DBLoader();

    }


})();
