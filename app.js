require('dotenv').config();
const server = require('./lib/server');
const containerized = require('containerized');

var kafkaHosts;

if (process.env.KAFKA_HOST) {
  kafkaHosts = process.env.KAFKA_HOST;
} else if (containerized()) {
  kafkaHosts = '172.17.0.1:2181';
} else {
  kafkaHosts = 'localhost:2181,localhost:2182,localhost:2183';
}

var listener = {
  type: 'kafka',
  json: false,
  connectionString: kafkaHosts,
  clientId: 'mosca',
  groupId: 'mosca',
  defaultEncoding: 'utf8',
  encodings: {
    'spiddal-adcp': 'buffer'
  }
};
var settings = {
  port: process.env.NODE_PORT || 1883,
  backend: listener,

  id: 'mosca',

  /*
  * avoid publishing to $SYS topics because
  * it violates kafka topic naming convention
  */
  stats: false,
  publishNewClient: false,
  publishClientDisconnect: false,
  publishSubscriptions: false
};

console.log('Kafka host: ', listener.connectionString);

var app = new server.start(settings);

app.on('published', function (packet, client) {
  if (packet.topic.indexOf('$SYS') === 0) return; // doesn't print stats info
  console.log('ON PUBLISHED', packet.payload.toString(), 'on topic', packet.topic);
});

app.on('ready', function () {
  console.log('MQTT Server listening on port', settings.port);
});

