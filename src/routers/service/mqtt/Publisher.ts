import * as buffer from "buffer";
import ResultBox from "../../dto/ResultBox";
import MQTT from "../../../ServerLoader/Target/MQTT";

const mqtt = require('mqtt');

export default class Publisher {

    private static staticPublisher: any;

    constructor() {


    }

    public static staticMqttPublish(topic: string, message: string) {

        const client = mqtt.connect('mqtt://localhost:1883');


        // 연결 이벤트 핸들러
        client.on('connect', () => {
            console.log('MQTT 브로커에 연결되었습니다.');
        });

        // 연결 상태 조회 메서드 사용 예시
        console.log('연결 상태:', client.connected);
    }


}
