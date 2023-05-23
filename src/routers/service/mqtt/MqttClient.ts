
import mqtt from "mqtt";

import Config from "../../../../config";
import MqttExecuter from "./MqttExecuter";
import Logger from "../../../modules/Logger";

export default () => {

    const url = 'tcp://127.0.0.1:8753';
    let client = mqtt.connect(url);


    client.on("connect", () => {
        Logger.info("MQTT Server online - " + url);
    })

    client.on("offline", () => {
        Logger.info("MQTT Server offline - " + url);
    })

}