# API (0.1.x)

Remember that this plugin has no protocol to structure requests and responses. Design your own protocol depending on your needs (e.g pub/sub).

- [Registration](#registration)
- [Server](#server)
- [Client](#client)
    - [`new Client(settings)`](#new-clientsettings)
    - [`client.Socket`](#clientsocket)
    - [`client.connect([options], callback)`](#clientconnectsettings-onconnect)
    - [Client Listeners](#client-listeners)

## Registration

Register **tricep** as a hapijs plugin with the following options:
- `server` - optional connection settings where values can be:
    - `port` - the port to listen to. Defaults to `9876`.
    - `host` - the host to listen to. Defaults to `localhost`.
    - `exclusive` - see the description [here](https://nodejs.org/api/net.html#net_server_listen_options_callback).
- `create` - optional server creation options where values can be:
    - `allowHalfOpen` - see the description [here](https://nodejs.org/api/net.html#net_net_createserver_options_connectionlistener).
    - `pauseOnConnect` - see the description [here](https://nodejs.org/api/net.html#net_net_createserver_options_connectionlistener).
- `onConnect(client)` - listener that will get invoked everytime a client connects where:
    - `client` - the net [socket](https://nodejs.org/api/net.html#net_class_net_socket) of the connecting client.
- `onError(err)` - listener that will get invoked when the server emits an error event where:
    - `err` - the error the socket will throw.

## Server

**tricep** exposes `server.tricep` which represents the net server object. Additional operations that you can do are:
- `server.tricep.onConnect(client)` - same signature are the `options.onConnect`. Override this if you want to have a different listener from what you initially assigned from `options.onConnect`.
- `server.tricep.onError(err)` - same signature are the `options.onError`. Override this if you want to have a different listener from what you initially assigned from `options.onError`.

## Client

Create a new **tricep** client.

### `new Client(settings)`

Create a new client where:
- `settings` - optional port and host settings where values can be:
    - `port` - the port to listen to. Defaults to 9876.
    - `host` - the host to listen to. Defaults to `localhost`.

### `client.Socket`

The client net [socket](https://nodejs.org/api/net.html#net_class_net_socket) object.

### `client.connect(settings, onConnect)`

Connects your client to the server where the parameters are:
- `settings` - optional server port and host settings where values can be:
    - `port` - the server port to connect to. Defaults to 9876.
    - `host` - the server host to connect to. Defaults to `localhost`.
- `onConnect()` - optional callback to invoke after the client has connected to the server.

### Client Listeners

Override these to modify the event listeners of the client.

- `onConnect()` - listener that will get invoked when client successfully connects to the server.
- `onDisconnect()` - listener that will get invoked when client disconnects from the server.
- `onData()` - listener that will get invoked when client receives data from the server.
- `onError(err)` - listener that will get invoked when the client emits an error event where:
    - `err` - the error the socket will throw.

