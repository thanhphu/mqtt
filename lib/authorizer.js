var debug = require('debug')('');
// Device = require('../app/models/devices/device');

module.exports.authenticate = function (client, username, password, callback) {
  doc = { _id: client.device_id, secret: password };
  callback(null, doc);

  // Device.findOne({ _id: username, secret: password }, function (err, doc) {
  //   if (doc) {
  //     debug('Authorized connection for device', doc.id);
  //   }
  //   else {
  //     debug('Error connecting', username, password);
  //   }
  //   if (doc) client.device_id = doc.id;
  //     callback(null, doc);
  // });
};

module.exports.authorizePublish = function (client, topic, payload, callback) {
  debug('AUTHORIZING SUBSCRIBE', client.device_id == topic.split('/')[1]);
  debug('DEVICE ID', client.device_id);
  debug('PAYLOAD', payload.toString());
  debug('TOPIC', topic);
  // callback(null, client.device_id == topic.split('/')[1]);
  callback(null, true);
};

module.exports.authorizeSubscribe = function (client, topic, callback) {
  debug('AUTHORIZING PUBLISH', client.device_id == topic.split('/')[1]);
  debug('DEVICE ID', client.device_id);
  debug('TOPIC', topic);
  // callback(null, client.device_id == topic.split('/')[1]);
  callback(null, true);
};