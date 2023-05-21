import * as buffer from "buffer";

const mqtt = require('mqtt');

// MQTT Subscriber
const subscriber = mqtt.connect('mqtt://localhost:1883');  // MQTT 브로커 호스트 및 포트 설정

subscriber.on('connect', function() {
    console.log('Subscriber connected to MQTT broker');

    // 구독
    subscriber.subscribe('topic', function(err: string) {
        if (err) {
            console.error('Subscribe error:', err);
        } else {
            console.log('Subscriber subscribed to topic');
        }
    });
});

// @ts-ignore
subscriber.on('message', function(topic: string, message: buffer) {
    console.log('Received message:', message.toString());
});
