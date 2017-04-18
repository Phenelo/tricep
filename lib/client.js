'use strict';

const Net = require('net');

const Client = function (settings) {

    const noop = function () {};

    if (settings) {
        settings.port = settings.port || 9876;
        settings.host = settings.host || 'localhost';
        this._settings = settings;
    }

    this.Socket = new Net.Socket();
    this.onData = noop;
    this.onError = null;
    this.onConnect = noop;
    this.onDisconnect = noop;
    this.Socket.on('data', (data) => {

        this.onData(data);
    });

    this.Socket.on('error', (err) => {

        if (this.onError) {
            this.onError(err);
        }
        else {
            throw err;
        }
    });

    this.Socket.on('connect', () => {

        this.onConnect(null, this.Socket);
    });

    this.Socket.on('disconnect', () => {

        this.onDisconnect();
    });
};

Client.prototype.connect = function (settings, next) {

    if (typeof settings === 'function') {
        next = arguments[0];
        settings = null;
    }

    this._settings = settings || this._settings || { port: 9876, host: 'localhost' };
    this.onConnect = next || this.onConnect;
    this.Socket.connect(this._settings);
};

exports.Client = Client;
