const assert = require('assert');
const io = require('socket.io-client');

const Server = require('../src/server/server');

describe('Chat Tests', () => {
  before((done) => {
    this.endpoint = '/chat';
    this.port = 8081;
    this.SERVERURL = `http://localhost:${this.port}${this.endpoint}`;
    this.server = new Server(this.port);
    this.server.verbose = false;
    this.server.start();
    this.server.createNamespace(this.endpoint);
    this.ns = this.server.namespaces[this.endpoint];
    this.ns.verbose = false;
    done();
  });

  after((done) => {
    this.server.end();
    done();
  });

  beforeEach((done) => {
    this.client = io(this.SERVERURL);
    this.client2 = io(this.SERVERURL);
    done();
  });

  afterEach((done) => {
    this.client.disconnect();
    this.client2.disconnect();
    done();
  });


  it('Message sent, client2 should receive message from client1', (done) => {
    let expected_sender = 'client1';
    let expected_message = 'hello client2, this is client1';

    this.client.emit('login', 'PEERID', 'client1');
    this.client2.emit('login', 'PEERID', 'client2');

    this.client.emit('chat message', expected_message);
    this.client2.on('chat message', (username, message) => {
      try {
        assert.equal(expected_sender, username);
        assert.equal(expected_message, message);
        done();
      }
      catch (e) {
        if (e instanceof assert.AssertionError) {
          done(e);
        }
      }
    });
  });


});