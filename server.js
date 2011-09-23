var express = require('express');

var port = process.env.PORT || 9999;
var server = express.createServer();

server.configure(
    function() {
        server.use(express.static(__dirname + '/root/'));
    }
);

server.post('/index_facebook.html',
    function(req, res) {
        res.redirect('https://www.facebook.com/dialog/oauth?client_id=271155132913470&redirect_uri=http://uberrogue.com/index_facebook.html');
    }
);

server.get('/favicon.ico',
    function(req, res) {
        res.redirect('/images/favicon.ico');
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
//    'websocket',   //Chrome 13+ sems to be having problems with websocket =/
    'flashsocket',
    'htmlfile',
    'xhr-polling',
    'jsonp-polling'
]);
var playerX = 5;
var playerY = 5;
var SCREEN_COLUMNS = 40;
var SCREEN_ROWS = 13;
io.sockets.on('connection', function (socket) {
    socket.emit('clearScreen');
    for (var x = 0; x < SCREEN_COLUMNS; x++) {

        for (var y = 0; y < SCREEN_ROWS; y++) {
            socket.emit('drawCharacter', { x: x, y:y, symbol:'.', color:'green', backgroundColor: 'black'});
        }
    }
    socket.emit('drawCharacter', { x: playerX, y:playerY, symbol:'@', color:'yellow', backgroundColor: 'black'});
    socket.on('keyPressed', function(data) {
        if (data == 87) {
            playerY--;
        }
        if (data == 83) {
            playerY++;
        }
        if (data == 65) {
            playerX--;
        }
        if (data == 68) {
            playerX++;
        }

        socket.emit('drawCharacter', { x: playerX, y:playerY, symbol:'@', color:'yellow', backgroundColor: 'black'});
        socket.broadcast.emit('drawCharacter', { x: playerX, y:playerY, symbol:'@', color:'yellow', backgroundColor: 'black'});
    });
});
