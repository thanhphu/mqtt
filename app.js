require('dotenv').config();
const server = require('./lib/server');
const containerized = require('containerized');

var amqpHost;

if (process.env.AMQP_HOST) {
  amqpHost = process.env.AMQP_HOST;
} else if (containerized()) {
  amqpHost = '172.17.0.1';
} else {
  amqpHost = 'localhost';
}

var listener = {
  // type: 'amqp',
  // json: false,
  // client: {
  //   host: amqpHost,
  //   port: process.env.AMQP_PORT || 5672,
  //   login: 'guest',
  //   password: 'guest'
  // },
  // amqp: require('amqp'),
  // exchange: 'mosca'
};
var settings = {
  port: process.env.NODE_PORT || 1883,
  backend: listener
};
// console.log('AMQP host: ', listener.client.host);

var app = new server.start(settings);

app.on('published', function (packet, client) {
  if (packet.topic.indexOf('$SYS') === 0) return; // doesn't print stats info
  console.log('ON PUBLISHED', packet.payload.toString(), 'on topic', packet.topic);
});

app.on('ready', function () {
  console.log('MQTT Server listening on port', settings.port);
});

