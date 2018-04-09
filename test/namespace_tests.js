const assert = require('assert');
const io = require('socket.io-client');

const Server = require('../src/server/server');

describe('Namespace Tests', () => {
  before((done) => {
    this.port = 8082;
    this.server = new Server(this.port);
    this.server.start();

    this.server.verbose = false;
    done();
  });

  after((done) => {
    this.server.end();
    done();
  });

  it('Create namespace, should be created under server.namespaces', (done) => {

    let client = io('http://localhost:' + this.port);
    client.emit('create namespace');
    client.on('namespace created', (endpoint) => {
      assert.equal(true, this.server.namespaces.hasOwnProperty(endpoint));
      assert.equal(true, this.server.ioserver.nsps.hasOwnProperty('/' + endpoint));
      client.disconnect();
      done();
    });
  });

  it('Destroy namespace, should no longer be under server.namespaces', (done) => {
    let endpoint = this.server.createNamespace();
    this.server.namespaces[endpoint].verbose = false;
    this.server.destroyNamespace(endpoint);

    assert.equal(false, this.server.namespaces.hasOwnProperty(endpoint));
    assert.equal(false, this.server.ioserver.nsps.hasOwnProperty('/' + endpoint));
    done();
  });

  it('Join namespace, namespace should exist', (done) => {
    let endpoint = this.server.createNamespace();

    let client = io('http://localhost:' + this.port);
    client.emit('join namespace', endpoint);

    client.on('join namespace', (endpoint) => {
      client.disconnect();
      done();
    });

    client.on('namespace not found', () => {
      client.disconnect();
      done(`Error: ${endpoint} namespace should exist`);
    });
  });

  it('Join namespace, namespace should not exist', (done) => {
    let client = io('http://localhost:' + this.port);
    client.emit('join namespace', '/IDontExist');

    client.on('join namespace', (endpoint) => {
      client.disconnect();
      done(`Error: ${endpoint} should not exist`);
    });

    client.on('namespace not found', (endpoint) => {
      client.disconnect();
      done();
    });
  });

});