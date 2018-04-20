module.exports = class User {
  constructor (socketID, peerID, username, userAvatar) {
    this._socketID = socketID;
    this._peerID = peerID;
    this._username = username;
    this._userAvatar = userAvatar;
  }

  get socketID() {
    return this._socketID;
  }

  get peerID() {
    return this._peerID;
  }

  get username() {
    return this._username;
  }

  get userAvatar() {
    return this._userAvatar;
  }
}

