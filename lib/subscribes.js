const WebSocket = require('ws');

module.exports =  function (server, client, message) {

    server.clients.forEach(function each(conn) {
        if (conn !== client && client.readyState === WebSocket.OPEN) {
            conn.send(message.toString());
        }
    });

}
