import mqtt from "mqtt";
import mosca from "mosca";
import Config from "../../../config";
import Logger from '../../modules/Logger';

export default async () => {
    // MQTT 브로커 설정
    const brokerSettings = {
        port: Config.MQTT_PORT, // MQTT 브로커 포트
        stats: false, // 통계 기능 비활성화
        logger: { // 로거 설정
            level: 'info', // 로그 레벨 설정
            name: 'mosca',
            childOf: Logger // Logger 모듈을 상속받음
        },
        persistence: {
            factory: mosca.persistence.Memory // 인메모리 영속성 팩토리 설정
        }
    };

    // Mosca MQTT 브로커 생성 및 설정
    const mqttBroker = new mosca.Server(brokerSettings);

    // Mosca 이벤트 리스너 등록
    mqttBroker.on('ready', () => {
        Logger.info('Mosca broker is ready'); // 로그 메시지를 Logger 모듈을 통해 출력
    });

    mqttBroker.on('published', (packet, client) => {
        Logger.info('Message published'); // 로그 메시지를 Logger 모듈을 통해 출력
        // packet 및 client 변수를 사용하여 원하는 작업 수행
    });
};
