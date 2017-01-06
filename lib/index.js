'use strict';

const Net = require('net');
const Client = require('./client');


exports.register = (server, options, next) => {

    const noop = function () {};

    let createOptions = {};
    let serverOptions = {};

    if (options.create) {
        createOptions = {
            allowHalfOpen: options.create.allowHalfOpen || false,
            pauseOnConnect: options.create.pauseOnConnect || false
        };
    }
    else {
        createOptions = {
            allowHalfOpen: false,
            pauseOnConnect: false
        };
    }

    if (options.server) {
        serverOptions = {
            port: options.server.port || 9876,
            host: options.server.host || 'localhost',
            exclusive: options.server.exclusive || true
        };
    }
    else {
        serverOptions = {
            port: 9876,
            host: 'localhost',
            exclusive: true
        };
    }

    const tricep = Net.createServer(createOptions, (client) => {

        tricep.onConnect(client);
    });

    tricep.onConnect = options.onConnect || noop;
    tricep.onError = options.onError || null;

    tricep.on('error', (err) => {

        if (tricep.onError) {
            tricep.onError(err);
        }
        else {
            throw err;
        }
    });

    tricep.listen(serverOptions);

    server.decorate('server', 'tricep', tricep);

    return next();
};


exports.register.attributes = {
    pkg: require('../package.json')
};


exports.Client = Client.Client;
