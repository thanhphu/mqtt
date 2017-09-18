var mosca = require('mosca'),
    authorizer = require('./authorizer'),
    debug = require('debug')('lelylan');

function app(settings) {

  function setup() {
    server.authenticate = authorizer.authenticate;
    server.authorizePublish = authorizer.authorizePublish;
    server.authorizeSubscribe = authorizer.authorizeSubscribe;
  }

  var server = new mosca.Server(settings, done);
  function done() { }

  server.on('ready', setup);

  return server;
}

module.exports.start = app;
