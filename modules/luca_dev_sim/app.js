'use strict';
var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;
var uuid = require('uuid');
var payload = {
  "body": {
    "machine": {
      "temperature": 50,
      "pressure": 10
    },
    "ambient": {
      "temperature": 21,
      "humidity": 25
    },
    "timeCreated": ""
  },
  "applicationProperties": {
    "sequenceNumber": "0",
    "batchId": "95a73faf-50b4-494b-996f-cbd0e0d2c829"
  }
}

Client.fromEnvironment(Transport, function (err, client) {
  if (err) {
    throw err;
  } else {
    client.on('error', function (err) {
      throw err;
    });

    // connect to the Edge instance
    client.open(function (err) {
      if (err) {
        throw err;
      } else {
        console.log('IoT Hub module client initialized');


        setInterval(() => {
          let timestamp = new Date();
          payload.body.machine.temperature = Math.random() * (48 - 42) + 42;
          payload.body.machine.pressure = 10 + Math.random();
          payload.body.ambient.temperature = Math.random() * (23 - 21) + 21;
          payload.body.ambient.humidity = Math.random() * (27 - 23) + 23;
          payload.body.timeCreated = timestamp;
          payload.applicationProperties.sequenceNumber += 1;
          if (Date.now() % 5 === 0)
            payload.body.machine.temperature += 120;
          let outputMsg = new Message(JSON.stringify(payload));
          outputMsg.messageId = uuid.v4();
          outputMsg.contentEncoding = 'utf-8';
          outputMsg.contentType = 'application/json';
          console.log(`${outputMsg.messageId} sent`)

          client.sendOutputEvent('output1', outputMsg, printResultFor('sending telemetry to iot hub'));
        }, 15000);
      }
    });
  }
});

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) {
      console.log(op + ' error: ' + err.toString());
    }
    if (res) {
      console.log(op + ' status: ' + res.constructor.name);
      //console.log('<---------------------------------------------------->\n')
    }
  };
}