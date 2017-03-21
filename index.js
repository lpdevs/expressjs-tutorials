// import express
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var constants = require('./constants')
var routers = require('./routers');

var app = express();

// set view engine
app.set('view engine', 'jade');
app.set('views', './public/html');

// use routers to handle request in '/'
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use('/', routers);

// Middleware function to log request protocol
app.use('/', function(req, res, next){
  console.log('A request for main page received at ' + Date.now());
  next();
});

/*
 * app.listen(port, [host], [backlog], [callback])
 * TODO: binds and listens for connections on the specified host and port.
 * @PARAM:
 * --> port: port number on which the server should accept incomming request.
 * --> host: Name of the domain.
 * --> backlog: maximum number of queued pending connections. default 511
 * --> callback: asynchronous function that is called when the server starts listening for the request.
 */
app.listen(constants.PORT, constants.HOST, constants.BACKLOG, function(){
  console.log('The server is listenning on ' + constants.HOST + ':' + constants.PORT);
});
