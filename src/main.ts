
import Config from "../config";
import UserLoader from "./ServerLoader/Target/User";
import DBLoader from "./ServerLoader/Target/Mysql";
//import AdminLoader from "./ServerLoader/Target/Admin";
//import DFSLoader from "./ServerLoader/Target/DFS";

import Logger from ".//modules/Logger";

(async function () {

    // 고객
    if (["USER"].indexOf(Config.SERVER_TYPE) >= 0) {
        Logger.info(Config.SERVER_TYPE + ' Is Loading')
        Logger.info('DB Is Loading')
        await DBLoader();
        await UserLoader();
    }

})();
