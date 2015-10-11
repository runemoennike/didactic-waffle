var http = require('http');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var service = require('./service/service');

var app = express();
app.set('port', 3000);

// Logging.
app.use(logger('dev'));

// Serve up the client UI.
app.use(express.static(path.join(__dirname, 'client')));

// Let the service hook itself up.
service.init(app);

// Start server
var server = http.createServer(app);
server.listen(3000);
