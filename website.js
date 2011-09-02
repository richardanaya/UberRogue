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
