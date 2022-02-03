'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');
const startWebSocketServer  = require('./lib/websocket');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));
const server = createServer(app);
startWebSocketServer(server)

server.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});
