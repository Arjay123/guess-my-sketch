const express = require('express');
const path = require('path');
const http = require('http');
const io = require('socket.io');

const Namespace = require('./namespace');

module.exports = class Server {
  constructor(port) {
    this.port = port;
    this.app = express();
    this.server = http.Server(this.app);
    this.ioserver = io(this.server);
    this.namespaces = {};

    // static files
    this.app.use('/build', express.static(path.resolve(__dirname + '/../../build')));

    // routing
    this.app.get('/', function(req, res) {
      res.sendFile(path.resolve(__dirname + '/../../index.html'));
    });

    this.ioserver.on('connection', (socket)=> {
      console.log(`default: ${socket.id} connected`);
    })

    this.ioserver.on('create namespace', (endpoint) => this.createNamespace(endpoint));
    this.ioserver.on('join namespace', () => console.log('join namespace'));
    this.ioserver.on('delete namespace', () => console.log('delete namespace'));
    // this.createNamespace('loginLogout');
  }

  createNamespace(endpoint) {
    let ns = new Namespace(endpoint, this.ioserver.of(`/${endpoint}`));
    this.namespaces[endpoint] = ns;
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
}