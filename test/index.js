'use strict';

const Hapi = require('hapi');
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
        createServer: (options, next) => {

            internals.onConnect = () => {

                next();

                return { stub: 'client' };
            };

            return {
                listen: () => {},
                on: (event, next) => {

                    internals.onError = next;
                }
            };
        }
    },
    onConnect: null,
    onError: null
};

const Tricep = proxyquire('../lib', { net: internals.net });

internals.register = function (options, next) {

    internals.server.register({
        register: Tricep,
        options: options
    }, (err) => {

        return next(err);
    });
};

internals.init = function () {

    internals.server = new Hapi.Server();
    internals.server.connection();
    internals.server.initialize();
};

describe('Registering the plugin', () => {

    beforeEach((done) => {

        internals.init();

        return done();
    });

    it('Should register Tricep with defaults', (done) => {

        const options = {};

        internals.register(options, (err) => {

            expect(err).to.not.exist();
            return done();
        });
    });

    it('Should register Tricep with empty create options', (done) => {

        const options = {
            create: {}
        };

        internals.register(options, (err) => {

            expect(err).to.not.exist();

            return done();
        });
    });

    it('Should register Tricep with null create options fields', (done) => {

        const options = {
            create: {
                allowHalfOpen: null,
                pauseOnConnect: null
            }
        };

        internals.register(options, (err) => {

            expect(err).to.not.exist();

            return done();
        });
    });

    it('Should register Tricep with create options', (done) => {

        const options = {
            create: {
                allowHalfOpen: true,
                pauseOnConnect: true
            }
        };

        internals.register(options, (err) => {

            expect(err).to.not.exist();

            return done();
        });
    });

    it('Should register Tricep with empty server options', (done) => {

        const options = {
            server: {}
        };

        internals.register(options, (err) => {

            expect(err).to.not.exist();

            return done();
        });
    });

    it('Should register Tricep with null server options fields', (done) => {

        const options = {
            server: {
                port: null,
                host: null,
                exclusive: null
            }
        };

        internals.register(options, (err) => {

            expect(err).to.not.exist();

            return done();
        });
    });

    it('Should register Tricep with server options', (done) => {

        const options = {
            server: {
                port: '8080',
                host: 'localhost',
                exclusive: true
            }
        };

        internals.register(options, (err) => {

            expect(err).to.not.exist();

            return done();
        });
    });

    it('Should register Tricep with null onConnect option', (done) => {

        const options = {
            onConnect: null
        };

        internals.register(options, (err) => {

            expect(err).to.not.exist();

            return done();
        });
    });

    it('Should register Tricep with onConnect option', (done) => {

        const options = {
            onConnect: () => {}
        };

        internals.register(options, (err) => {

            expect(err).to.not.exist();

            return done();
        });
    });

    it('Should register Tricep with null onError option', (done) => {

        const options = {
            onError: null
        };

        internals.register(options, (err) => {

            expect(err).to.not.exist();

            return done();
        });
    });

    it('Should register Tricep with onError option', (done) => {

        const options = {
            onError: () => {}
        };

        internals.register(options, (err) => {

            expect(err).to.not.exist();

            return done();
        });
    });

    it('Should fake a client connection', (done) => {

        const options = {
            server: {
                port: 8080,
                host: 'localhost'
            }
        };

        internals.register(options, (err) => {

            const stub = internals.onConnect();

            expect(stub).to.equal({ stub: 'client' });
            expect(internals.server.tricep).to.exist();
            expect(err).to.not.exist();

            return done();
        });
    });

    it('Should emit an error with error function to catch', (done) => {

        const options = {
            server: {
                port: 8080,
                host: 'localhost'
            },
            onError: () => {}
        };

        internals.register(options, (err) => {

            internals.onError();
            expect(internals.server.tricep).to.exist();
            expect(internals.server.tricep.onError).to.exist();
            expect(err).to.not.exist();

            return done();
        });
    });

    it('Should throw an error', (done) => {

        const options = {
            server: {
                port: 8080,
                host: 'localhost'
            },
            onError: null
        };

        try {
            internals.register(options, (err) => {

                expect(err).to.not.exist();
                internals.onError();
            });
        }
        catch (err) {
            expect(err).to.exist();

            return done();
        }
    });
});
