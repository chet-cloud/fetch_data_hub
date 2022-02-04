'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));
const server = createServer(app);
require('./lib/websocket')(server)

server.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});
