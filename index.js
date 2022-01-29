'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');
const subscribes = require('./lib/subscribes');
const WebSocket = require('ws')


const app = express();
app.use(express.static(path.join(__dirname, '/public')));
const server = createServer(app);
const wss = new WebSocket.Server({server: server, clientTracking: true, noServer: false});


const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
            return ws.terminate();
        }
        ws.isAlive = false;
        if (ws['isBrowser']) {
            ws.send("ping")
        } else {
            ws.ping();
        }
    });
}, 30000);

wss.on('close', function close() {
    clearInterval(interval);
});


wss.on('connection', function (ws, request) {
    ws.isAlive = true;
    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.send("->: Hi")

    ws.on('message', function (message) {
        if (message === "pong") {
            ws.isAlive = true;
            ws['isBrowser'] = true
        }
        subscribes(wss, ws, message)
        console.log(`Received message ${message} `);
    });

    ws.on('close', function () {
        console.log(`close ${ws}`);
    });

});

//
// Start the server.
//
server.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});
