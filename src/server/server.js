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

  /**
   * start() starts the server by listening to designated port
   */
  start() {
    this.server.listen(this.port, () => {
      console.log(`Listening to port ${this.port}`);
    });
  }

  /**
   * end() closes the server
   */
  end() {
    this.server.close(() => {
      console.log(`Server listening to port ${this.port} has closed`);
    });
  }

  /**
   * addEventListeners() adds all event listeners to namespace
   *
   * @param {Namespace} namespace
   */
  addEventListeners(namespace) {
    let self = this;

    namespace.on('connect', function(socket) {
      socket.on('login', (peerID, username) => self.login(socket, peerID, username));
      socket.on('disconnect', () => self.logout(socket));
      socket.on('logout', () => self.logout(socket));
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
    console.log(`${socket.id} attempting to log in as: ${username}`);
    if (this.getUserByUsername(username)) {
      console.log(`Username ${username} is already in use`);

      socket.emit('login fail', 'Username is in use');
      return;
    }

    var newUser = new User(socket.id, peerID, username);
    this.users[socket.id] = newUser;

    console.log(`${socket.id} has logged in as: ${username}`);
    console.log('Current Users');
    console.log(this.users);

    socket.emit('login success', (username));
  }

  /**
   * logout() logs user out of services & deletes from user list
   */
  logout(socket) {
    if (this.users.hasOwnProperty(socket.id)) {
      let user = this.users[socket.id];
      console.log(`Logging out user: ${user.username}`);
      delete this.users[socket.id];
      socket.emit('logout success');
    }
  }

  /**
   * getUserByUsername returns user if user exists
   */
  getUserByUsername(username) {
    for (var id in this.users) {
      if (username === this.users[id].username)
        return this.users[id];
    }
    return null;
  }
}




