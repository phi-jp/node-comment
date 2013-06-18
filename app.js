
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);
var userId = 0;
io.sockets.on('connection', function(socket) {
  socket.handshake.userId = userId;
  userId++;

  socket.emit("connected", { userId: socket.handshake.userId });

  // player enter
  socket.on('player create', function(data) {
  	data.userId = socket.handshake.userId;
    socket.broadcast.emit('player create', data);
  });
  // player update
  socket.on('player update', function(data) {
  	data.userId = socket.handshake.userId;
    socket.broadcast.emit('player update', data);
  });
});

