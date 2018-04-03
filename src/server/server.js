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
    this.verbose = true;

    // static files
    this.app.use('/build', express.static(path.resolve(__dirname + '/../../build')));

    // routing
    this.app.get('/', function(req, res) {
      res.sendFile(path.resolve(__dirname + '/../../index.html'));
    });

    let self = this;
    this.ioserver.on('connection', (socket)=> {
      self.print(`default: ${socket.id} connected`);
    })

    this.ioserver.on('create namespace', (endpoint) => this.createNamespace(endpoint));
    this.ioserver.on('join namespace', () => console.log('join namespace'));
    this.ioserver.on('delete namespace', () => console.log('delete namespace'));
  }

  print(message) {
    if (this.verbose) console.log(`default: ${message}`);
  }

  /**
   * createNamespace() creates a new namespace under the provided
   * endpoint and adds it to the namespaces object
   *
   * @param {String} endpoint
   */
  createNamespace(endpoint) {
    let ns = new Namespace(endpoint, this.ioserver.of(endpoint), this.destroyNamespace);
    this.namespaces[endpoint] = ns;
  }

  /**
   * destroyNamespace() begins namespace destruction process by
   * signaling namespace to deallocate its resources and call
   * destroyNamespaceCallback upon completion
   *
   * @param {String} endpoint
   */
  destroyNamespace(endpoint) {
    if (this.namespaces.hasOwnProperty(endpoint)) {
      this.namespaces[endpoint].destroy(this.destroyNamespaceCallback.bind(this));
    }
  }

  /**
   * destroyNamespaceCallback() is called once a namespace's
   * resources are deallocated, deletes namespace from namespace
   * object and ioserver's stored nsps
   *
   * @param {String} endpoint
   */
  destroyNamespaceCallback(endpoint) {
    this.print(`Namespace: ${endpoint} empty, ready to delete`);

    if (this.ioserver.nsps.hasOwnProperty(endpoint))
      delete this.ioserver.nsps[endpoint];

    if (this.namespaces.hasOwnProperty(endpoint));
      delete this.namespaces[endpoint];
    this.print(`Namespace: ${endpoint} deleted`);
  }

  /**
   * start() starts the server by listening to designated port
   */
  start() {
    let self = this;
    this.server.listen(this.port, () => {
      self.print(`Listening to port ${this.port}`);
    });
  }

  /**
   * end() closes the server
   */
  end() {
    let self = this;
    this.server.close(() => {
      self.print(`Server listening to port ${this.port} has closed`);
    });
  }
}