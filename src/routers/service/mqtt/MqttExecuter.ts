import mqtt from "mqtt";

export default class MqttExecuter {
    private static client: mqtt.MqttClient;

    constructor() {
        // MQTT 클라이언트 초기화 및 연결 설정
        MqttExecuter.client = mqtt.connect("tcp://127.0.0.1");
    }

    public static publishMessage(topic: string, message: any): void {
        console.log(this.client);

        MqttExecuter.client.publish(topic, JSON.stringify(message));

    }
}

