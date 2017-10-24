'use strict';
require('dotenv').config();
const mosca = require('mosca');
const server = require('./lib/server');
const rabbitHelper = require('./rabbit-helper.js');
const containerized = require('containerized');

function startApp(settings) {
  var app = new server.start(settings);
  
  app.on('error', function(err) {
    console.log('Error: ', err);
  });
  
  app.on('published', function (packet) {
    if (packet.topic.indexOf('$SYS') === 0) {
      return; // doesn't print stats info 
    }
    console.log('ON PUBLISHED', packet.payload.toString(), 'on topic', packet.topic);
  });
  
  app.on('ready', function () {
    console.log('MQTT Server listening on port', settings.port);
  });  
}

var redisHost;
if (process.env.REDIS_HOST) {
  redisHost = process.env.REDIS_HOST;
} else if (containerized()) {
  redisHost = '172.17.0.1';
} else {
  redisHost = 'localhost';
}

var amqpHosts;
if (process.env.AMQP_HOST) {
  amqpHosts = process.env.AMQP_HOST.split(',');
} else if (containerized()) {
  amqpHosts = [
    'rabbit1',
    'rabbit2',
    'rabbit3'
  ];
} else {
  amqpHosts = [
    'localhost'
  ];
}

console.log('Config AMQP hosts:', amqpHosts);
rabbitHelper.selectRabbit(amqpHosts, 'publisher', (selectedNode) => {
  var listener = {
    type: 'amqp',
    json: false,
    client: {
      host: selectedNode,
      port: 5672,
      login: 'guest',
      password: 'guest'
    },
    amqp: require('amqp'),
    exchange: 'mosca'
  };
  
  var settings = {
    port: process.env.NODE_PORT || 1883,
    backend: listener,
    persistence: {
      factory: mosca.persistence.Redis,
      host: redisHost,
      port: 6379
    }
  };
  console.log('AMQP host:', listener.client.host);
  startApp(settings);
});


