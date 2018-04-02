const express = require('express');
const path = require('path');
const http = require('http');
const io = require('socket.io');

const User = require('./user');

module.exports = class Server {
  constructor(port) {
    this.port = port;
    this.app = express();
    this.server = http.Server(this.app);
    this.ioserver = io(this.server);
    this.users = {};

    // static files
    this.app.use('/build', express.static(path.resolve(__dirname + '/../../build')));

    // routing
    this.app.get('/', function(req, res) {
      res.sendFile(path.resolve(__dirname + '/../../index.html'));
    });

    this.addEventListeners(this.ioserver);
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`Listening to port ${this.port}`);
    });
  }

  end() {
    this.server.close(() => {
      console.log(`Server listening to port ${this.port} has closed`);
    });
  }

  addEventListeners(namespace) {
    let self = this;

    namespace.on('connect', function(socket) {
      // console.log('a user connected: ' + socket.id);
      socket.emit('test', {'testKey': 'testValue'});

      socket.on('login', (peerID, username) => self.login(socket, peerID, username));
      socket.on('disconnect', () => {
        console.log(socket.id + ' has logged out');
        delete self.users[socket.id];
      });
    });
  }

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
  login(socket, peerID, username) {
    if (this.usernameInUse(username)) {
      console.log(`Username ${username} is already in use`);

      socket.emit('login fail', 'Username is in use');
      return;
    }
    var newUser = new User(socket.id, peerID, username);
    this.users[socket.id] = newUser;

    socket.emit('login success', (username));
  }

  /**
   * usernameInUse() returns true if username
   * is already being used, by checking the users object
   *
   * @param {String} username
   */
  usernameInUse(username) {
    for (var id in this.users){
      if (username === this.users[id].username)
        return true;
    }
    return false;
  }
}




