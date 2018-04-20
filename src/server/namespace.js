const User = require('./user');

module.exports = class Namespace {
  constructor(endpoint, namespace) {
    this.endpoint = endpoint;
    this.namespace = namespace;
    this.users = {};
    this.verbose = true;
    this.userCt = 0;
    this.availableAvatars = [
      {color: 'lightblue'},
      {color: 'lightcoral'},
      {color: 'lightgreen'},
      {color: 'lightslategray'},
      {color: 'lightpink'},
      {color: 'lightsalmon'},
      {color: 'lightseagreen'},
      {color: 'lightsteelblue'},
    ];
    this.usedAvatars = [];


    let self = this;
    this.namespace.on('connection', function(socket) {
      self.print(`${socket.id} connected`);
      self.sendUserlist();
      socket.on('login', (peerID, username) => self.login(socket, peerID, username, self.sendUserlist.bind(self)));
      socket.on('disconnect', () => self.logout(socket, self.sendUserlist.bind(self)));
      socket.on('logout', () => self.logout(socket, self.sendUserlist.bind(self)));
      socket.on('chat message', (message) => self.sendMessage(socket, message));
      socket.on('canvas drawing', (drawing) => self.sendDrawing(socket, drawing));
      socket.on('start game', () => { self.namespace.emit('start game'); })
    });
  }

  avatarSelected() {
    let avatar = this.availableAvatars.pop();
    this.usedAvatars.push(avatar);
    return avatar;
  }

  avatarReleased(avatar) {
    for (var i = 0; i < this.usedAvatars.length; i++) {
      if (this.usedAvatars[i].color === avatar.color) {
        this.usedAvatars.splice(i, 1);
        this.availableAvatars.push(avatar);
      }
    }
  }

  getUsernames() {
    let usernames = [];
    let userIDs = Object.keys(this.users);

    userIDs.forEach((userID) => {
      usernames.push(this.users[userID].username);
    });

    return usernames;
  }

  print(message) {
    if (this.verbose) console.log(`${this.endpoint}: ${message}`);
  }

  sendDrawing(socket, drawing) {
    this.print(`${socket.id} sending drawing:`);
    console.log(drawing);
    socket.broadcast.emit('canvas drawing', drawing);
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
      this.namespace.emit('chat message', socket.id, message);
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
  login(socket, peerID, username, callback) {
    this.print(`${socket.id} attempting to log in as: ${username}`);
    if (this.getUserByUsername(username)) {
      this.print(`Username ${username} is already in use`);

      socket.emit('login fail', 'Username is in use');
      return;
    }
    this.userCt++;
    var newUser = new User(socket.id, peerID, username, this.avatarSelected());
    this.users[socket.id] = newUser;

    this.print(`${socket.id} has logged in as: ${username}`);
    socket.emit('login success', (username));
    callback();
  }

  /**
   * logout() logs user out of services & deletes from user list
   */
  logout(socket, callback) {
    this.print(`Attempting to log out ${socket.id}`);
    if (this.users.hasOwnProperty(socket.id)) {
      let user = this.users[socket.id];
      this.print(`Logging out user: ${user.username}`);
      this.avatarReleased(user.userAvatar)
      delete this.users[socket.id];
      this.userCt--;
      socket.emit('logout success');
      callback();
    }
  }

  /**
   * sendUserlist() sends connected users list to
   * all connected users in namespace
   */
  sendUserlist() {
    this.print('Current Users');
    this.print(JSON.stringify(this.users, null, 2));
    this.namespace.emit('user list', this.users);
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




