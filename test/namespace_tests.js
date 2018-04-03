const assert = require('assert');
const io = require('socket.io-client');

const Server = require('../src/server/server');

describe('Namespace Tests', () => {
  before((done) => {
    this.endpoint = '/namespaces';
    this.port = 8082;
    this.SERVERURL = `http://localhost:${this.port}${this.endpoint}`;
    this.server = new Server(this.port);
    this.server.verbose = false;
    this.server.start();
    done();
  });

  after((done) => {
    this.server.end();
    done();
  });

  it('Create namespace, should be created under server.namespaces', (done) => {
    this.server.createNamespace(this.endpoint);

    assert.equal(true, this.server.namespaces.hasOwnProperty(this.endpoint));
    assert.equal(true, this.server.ioserver.nsps.hasOwnProperty(this.endpoint));
    done();
  });

  it('Destroy namespace, should no longer be under server.namespaces', (done) => {
    this.server.createNamespace(this.endpoint);
    this.server.namespaces[this.endpoint].verbose = false;
    this.server.destroyNamespace(this.endpoint);

    assert.equal(false, this.server.namespaces.hasOwnProperty(this.endpoint));
    assert.equal(false, this.server.ioserver.nsps.hasOwnProperty(this.endpoint));
    done();
  });
});