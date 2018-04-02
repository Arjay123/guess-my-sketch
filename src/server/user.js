module.exports = class User {
  constructor (socketID, peerID, username) {
    this._socketID = socketID;
    this._peerID = peerID;
    this._username = username;
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
}

