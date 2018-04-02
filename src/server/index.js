const express = require('express');
const path = require('path');
const http = require('http');

const User = require('./user');

let app = express();
let server = http.Server(app);
let io = require('socket.io').listen(server);

// static files
app.use('/build', express.static(path.resolve(__dirname + '/../../build')));

// routing
app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../../index.html'));
});

let users = {

};

io.on('connect', function(socket) {
  // console.log('a user connected: ' + socket.id);
  socket.emit('test', {'testKey': 'testValue'});

  socket.on('login', (peerID, username) => login(socket, peerID, username));
});



/**
 * login() attemps to log in the user using the preferred username,
 * if username is in use, sends failed login event back to user
 * if success, creates new user and adds to users list,
 *  send user login sucess event
 *
 * @param {String} socket - socket of user
 * @param {String} peerID - peerID of user
 * @param {String} username - potential username of user
 */
function login(socket, peerID, username) {
  if (usernameInUse(username)) {
    console.log(`Username ${username} is already in use`);

    socket.emit('login fail', 'Username is in use');
    return;
  }
  console.log(users);
  var newUser = new User(socket.id, peerID, username);
  users[socket.id] = newUser;

  socket.emit('login success', (username));
}

/**
 * usernameInUse() returns true if username
 * is already being used, by checking the users object
 *
 * @param {String} username
 */
function usernameInUse(username) {
  for (var id in users){
    if (username === users[id].username)
      return true;
  }
  return false;
}

server.listen(3000, () => {
  console.log('Listening to port 3000d');
});

