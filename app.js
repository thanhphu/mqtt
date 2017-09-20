require('dotenv').config();
const server = require('./lib/server');
const debug = require('debug')('lelylan');
const containerized = require('containerized');

var amqpHost = 'localhost';

if (containerized()) {
  amqpHost = '172.17.0.1';
}

var listener = {
  type: 'amqp',
  json: false,
  client: {
    host: amqpHost,
    port: 5672,
    login: 'guest',
    password: 'guest'
  },
  amqp: require('amqp'),
  exchange: 'mosca'
};
var settings = {
  port: process.env.NODE_PORT || 1883,
  backend: listener
};

var app = new server.start(settings);

app.on('published', function (packet, client) {
  if (packet.topic.indexOf('$SYS') === 0) return; // doesn't print stats info
  console.log('ON PUBLISHED', packet.payload.toString(), 'on topic', packet.topic);
});

app.on('ready', function () {
  console.log('MQTT Server listening on port', settings.port);
});

