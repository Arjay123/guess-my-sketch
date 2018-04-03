const User = require('./user');

module.exports = class Namespace {
  constructor(endpoint, namespace) {
    this.endpoint = endpoint;
    this.namespace = namespace;
    this.users = {};
    this.verbose = true;

    let self = this;
    this.namespace.on('connection', function(socket) {
      self.print(`${socket.id} connected`);
      socket.on('login', (peerID, username) => self.login(socket, peerID, username));
      socket.on('disconnect', () => self.logout(socket));
      socket.on('logout', () => self.logout(socket));
      socket.on('chat message', (message) => self.sendMessage(socket, message));
    });
  }

  print(message) {
    if (this.verbose) console.log(`${this.endpoint}: ${message}`);
  }

  /**
   * sendMessage() sends message from socket to rest of
   * connected sockets in this namespace
   *
   * @param {Socket} socket - message sender
   * @param {String} message - text of message
   */
  sendMessage(socket, message) {
    let user = this.getUserBySocketID(socket.id);
    if (user) {
      socket.broadcast.emit('chat message', user.username, message);
    }
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
    this.print(`${socket.id} attempting to log in as: ${username}`);
    if (this.getUserByUsername(username)) {
      this.print(`Username ${username} is already in use`);

      socket.emit('login fail', 'Username is in use');
      return;
    }

    var newUser = new User(socket.id, peerID, username);
    this.users[socket.id] = newUser;

    this.print(`${socket.id} has logged in as: ${username}`);
    this.print('Current Users');
    this.print(this.users);

    socket.emit('login success', (username));
  }

  /**
   * logout() logs user out of services & deletes from user list
   */
  logout(socket) {
    this.print(`Attempting to log out ${socket.id}`);
    if (this.users.hasOwnProperty(socket.id)) {
      let user = this.users[socket.id];
      this.print(`Logging out user: ${user.username}`);
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

  /**
   * getUserBySocketID returns user if user exists
   */
  getUserBySocketID(socketID) {
    if (this.users.hasOwnProperty(socketID))
      return this.users[socketID];
  }

  /**
   * destroy() removes all sockets and event listeners and
   * signals server to destroy namespace instance
   */
  destroy(callback) {
    const connections = Object.keys(this.namespace.connected);


    let self = this;
    this.print(`Disconnecting all sockets`);
    connections.forEach((socketID) => {
      this.print(`Disconnecting socket: ${socketID}`);
      self.namespace.connected[socketID].disconnect();
    });

    this.print(`Removing listeners`);
    this.namespace.removeAllListeners();
    callback(this.endpoint);
  }
}




