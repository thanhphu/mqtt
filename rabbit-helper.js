// Selects rabbitMQ with least connection
const _ = require('lodash');
const request = require('request');
const async = require('async');

/**
 * hosts: array of hosts to query from
 * type: type of least connection to select, available types:
 *    'publisher': when called from mosca
 *    'subscriber': when called from collector
 */
module.exports.selectRabbit = function(hosts, type, done) {
    function _callQueueApi(host, cb) {
        const url = `http://guest:guest@${host}:15672/api/queues`;
        request({
            url: url,
            json: true
        }, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                cb(body);
            } else {
                cb();
            }
        });
    }
    
    function _getNodesInfo(hosts, type, cb) {
        _.forEach(hosts, (host) => {
            _callQueueApi(host, (body) => {
                if (body) {
                    cb(body, type);
                }
            });
        });
        cb();
    }
    
    function _selectLeastConnectedNode(allCount, typeCount) {
        // Add back nodes with zero connections
        var leastConnectionCount, leastConnectedNode;
        _.forEach(allCount, (value, key) => {
            
            if (!typeCount[key]) {
                typeCount[key] = 0;
            }
    
            // Select node with least connections
            if (leastConnectionCount === undefined) {
                leastConnectionCount = value;
            }

            if (leastConnectionCount >= typeCount[key]) {
                leastConnectionCount = typeCount[key];
                leastConnectedNode = key;
            }
        });
        return leastConnectedNode;
    }
    
    function _extractNodeName(longNodeName) {
        return longNodeName.split('@')[1];
    }
    
    function _selectNode(nodesInfo, type) {
        if (nodesInfo) {
            // Count of all types of conection to all nodes
            // Example: Object {rabbit@rabbit1: 2, rabbit@rabbit2: 1, rabbit@rabbit3: 1}
            var allCount = _.countBy(nodesInfo, (node) => node.node); 
            if (type === 'publisher') {
                // Mosca makes non-durable queues, keep durable queues
                _.remove(nodesInfo, (node) => node.durable == true);
            } else {
                // We use durable queues in consumers
                _.remove(nodesInfo, (node) => node.durable == false);
            }
            // Count of only the connection type we want
            var typeCount = _.countBy(nodesInfo, (node) => node.node);
    
            var leastConnectedNode = _selectLeastConnectedNode(allCount, typeCount);
            var leastConnectedNodeName = _extractNodeName(leastConnectedNode);
            done(leastConnectedNodeName);
        }
    }

    _getNodesInfo(hosts, 'subscriber', _selectNode);
    return `amqp://guest:guest@${hosts[_.random(0, hosts.length - 1)]}:5672`;
};