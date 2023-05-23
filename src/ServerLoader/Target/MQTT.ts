import Config from "../../../config";
import Mosca from "../../modules/Mosca";

export default async () => {

    let moscaOption = {
        port: Config.PORT,
        host: '127.0.0.1'
    }

    const server = Mosca.runServer(moscaOption);

}
