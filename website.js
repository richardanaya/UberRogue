var express = require('express');

var port = process.env.PORT || 9999;
var server = express.createServer();

server.configure(
    function() {
        server.use(express.static(__dirname + '/root/'));
    }
);

server.get(/^.*$/,
    function(req, res) {
        res.redirect('/index.html');
    }
);

server.listen(port);

var io = require('socket.io').listen(server);
io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.set('log level', 1);                    // reduce logging
io.set('transports', [                     // enable all transports (optional if you want flashsocket)
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);
var x = 5;
var y = 5;
io.sockets.on('connection', function (socket) {
    socket.emit('drawCharacter', { x: x, y:y, symbol:'@'});
    socket.on('keyPressed', function(data) {

        if(data == 87) {
            y--;
        }
        if(data == 83) {
            y++;
        }
        if(data == 65) {
            x--;
        }
        if(data == 68) {
            x++;
        }

        socket.emit('drawCharacter', { x: x, y:y, symbol:'@'});
    });
});
