const express = require('express');
const path = require('path');
const http = require('http');

let app = express();
let server = http.Server(app);
let io = require('socket.io').listen(server);

// static files
app.use('/build', express.static(path.resolve(__dirname + '/../../build')));

// routing
app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../../index.html'));
})

io.on('connect', function(socket) {
  // console.log('a user connected: ' + socket.id);
  socket.emit('test', {'testKey': 'testValue'});
});

server.listen(3000, () => {
  console.log('Listening to port 3000d');
});

