# tricep

A raw hapijs plugin for setting up TCP support using native node TCP (net).

## Server
```js
const Hapi = require('hapi');
const Tricep = require('tricep');

const server = new Hapi.Server();

server.connection();

server.register({
    register: Tricep,
    options: {
        server: {
            port: 9876,
            host: 'localhost'
        },
        onConnect: (client) => {

            client.write('Hello.');
        },
        onError: (err) => {

            console.log('Error: ', err);
        }
    }
}, (err) => {

    // Do your thing.
});
```

After registering, `server.tricep` will be available which represents the net server object.

## Client
```js
const Tricep = require('tricep');

const client = new Tricep.Client({
    port: 9876,
    host: 'localhost'
});

client.connect(() {

    // Client is now connected

    client.onData = (data) {

        console.log(data.toString('utf8'));
    };
});
```

See the [API](https://github.com/Phenelo/tricep/blob/master/API.md) and
[net](https://nodejs.org/api/net.html) for more information.

## Contributing
* Include 100% test coverage.
* Follow the [Hapi coding conventions](http://hapijs.com/styleguide)
* Submit an issue first for significant changes.


