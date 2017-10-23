require('dotenv').config();
const mosca = require('mosca');
const server = require('./lib/server');
const containerized = require('containerized');

var amqpHost;

if (process.env.AMQP_HOST) {
  amqpHost = process.env.AMQP_HOST;
} else if (containerized()) {
  amqpHost = ['amqp://guest:guest@172.17.0.1:5672'];
} else {
  amqpHost = [
    'amqp://guest:guest@localhost:5672'
  ];
}

var listener = {
  type: 'amqp',
  json: false,
  client: {
    host: amqpHost,
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
    host: "localhost",
    port: 6379
  }
};
console.log('AMQP host: ', listener.client.host);

var app = new server.start(settings);

app.on('error', function(err) {
  console.log('Error: ', err);
});

app.on('published', function (packet, client) {
  if (packet.topic.indexOf('$SYS') === 0) return; // doesn't print stats info
  console.log('ON PUBLISHED', packet.payload.toString(), 'on topic', packet.topic);
});

app.on('ready', function (mh) {
  console.log('MQTT Server listening on port', settings.port);
});

