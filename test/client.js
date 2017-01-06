'use strict';

const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;
const proxyquire = require('proxyquire');

const internals = {
    net: {
        Socket: function () {

            this.on = (event, next) => {

                internals.events[event] = next;
            };

            this.connect = () => {

                internals.connected = true;
            };
        }
    },
    onConnect: null,
    events: {},
    client: null
};

const Client = proxyquire('../lib/client', { net: internals.net });

describe('Creating a client', () => {

    beforeEach((done) => {

        return done();
    });

    it('Should create a client with defaults', (done) => {

        const noop = function () {};
        const client = new Client.Client();

        expect(client.Socket).to.exist();
        expect(client.connect).to.exist();
        expect(client.onData.toString()).to.equal(noop.toString());
        expect(client.onConnect.toString()).to.equal(noop.toString());
        expect(client.onDisconnect.toString()).to.equal(noop.toString());
        expect(client.onError).to.not.exist();
        expect(client._settings).to.not.exist();

        return done();
    });

    it('Should create a client with settings', (done) => {

        const noop = function () {};
        const settings = { port: 8080, host: 'localhost' };
        const client = new Client.Client(settings);

        expect(client.Socket).to.exist();
        expect(client.connect).to.exist();
        expect(client.onData.toString()).to.equal(noop.toString());
        expect(client.onConnect.toString()).to.equal(noop.toString());
        expect(client.onDisconnect.toString()).to.equal(noop.toString());
        expect(client.onError).to.not.exist();
        expect(client._settings).to.equal(settings);

        return done();
    });

    it('Should create a client with null settings fields', (done) => {

        const noop = function () {};
        const settings = { port: 9876, host: 'localhost' };
        internals.client = new Client.Client({ port: null, host: null });

        expect(internals.client.Socket).to.exist();
        expect(internals.client.connect).to.exist();
        expect(internals.client.onData.toString()).to.equal(noop.toString());
        expect(internals.client.onConnect.toString()).to.equal(noop.toString());
        expect(internals.client.onDisconnect.toString()).to.equal(noop.toString());
        expect(internals.client.onError).to.not.exist();
        expect(internals.client._settings).to.equal(settings);

        return done();
    });

    it('Should invoke onData', (done) => {

        internals.client.onData = function (data) {

            expect(data).to.equal('data');

            return done();
        };

        internals.events.data('data');
    });

    it('Should invoke onError', (done) => {

        internals.client.onError = function (err) {

            expect(err).to.equal('error');

            return done();
        };

        internals.events.error('error');
    });

    it('Should throw an error on onError invoke', (done) => {

        internals.client.onError = null;

        try {
            internals.events.error('error');
        }
        catch (err) {

            expect(err).to.equal('error');

            return done();
        }
    });

    it('Should invoke onConnect', (done) => {

        internals.client.onConnect = function (res) {

            expect(res).to.not.exist();

            return done();
        };

        internals.events.connect('connect');
    });

    it('Should invoke onDisconnect', (done) => {

        internals.client.onDisconnect = function (res) {

            expect(res).to.not.exist();

            return done();
        };

        internals.events.disconnect('disconnect');
    });
});

describe('Connecting the client', () => {

    beforeEach((done) => {

        internals.connected = false;

        return done();
    });

    it('Should connect the client with settings and listener provided', (done) => {

        const settings = { port: 8080, host: 'localhost' };

        internals.client.connect(settings, () => {});

        expect(internals.connected).to.equal(true);

        return done();
    });

    it('Should connect the client with only listener provided', (done) => {

        internals.client.connect(() => {});

        expect(internals.connected).to.equal(true);

        return done();
    });

    it('Should connect the client with null settings provided', (done) => {

        internals.client.connect(null, () => {});

        expect(internals.connected).to.equal(true);

        return done();
    });

    it('Should connect the client with null _settings', (done) => {

        internals.client._settings = null;

        internals.client.connect(null, () => {});

        expect(internals.connected).to.equal(true);

        return done();
    });

    it('Should connect the client with null listener', (done) => {

        internals.client._settings = null;

        internals.client.connect(null, null);

        expect(internals.connected).to.equal(true);

        return done();
    });

});
