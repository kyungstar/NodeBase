
import mosca from "mosca";
import Logger from "./Logger";

class Mosca {

    private server: mosca.Server;

    runServer(option: object) {
        this.server = new mosca.Server(option);

        this.server.on("ready", () => {
            console.log(this.server.opts.host)
            Logger.info("MQTT Server Ready - " + (this.server.opts.host || "tcp://127.0.0.1") + ":" + this.server.opts.port);
        });

        this.server.on("connect", () => {
            Logger.info("MQTT Server Connected - " + (this.server.opts.host || "tcp://127.0.0.1") + ":" + this.server.opts.port);
        });

        this.server.on("subscribed", (topic: string, client: mosca.Client) => {
            Logger.debug("client subscribe - " + client.id + " // " + topic);
        });

        this.server.on("clientConnected", function (client: mosca.Client) {
            Logger.info("new Client - " + client.id);
        });

        this.server.on("published", function (packet: mosca.Packet, client: mosca.Client) {
            Logger.debug("published - " + packet.topic + " / " + packet.payload);
        });

        return;
    }

}

export default new Mosca();