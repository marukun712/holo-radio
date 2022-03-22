const express = require("express");
const app = express();
const port = 3000;

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    app.use(express.static('.'));

    res.sendFile(__dirname + '/src/html/index.html');
});
io.on('connection', function(socket) {
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });
});

http.listen(2000, function() {
    console.log('2000で起動したよ');
});