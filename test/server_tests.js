const assert = require('assert');
const ioclient = require('socket.io-client');
const ioserver = require('socket.io');

const Server = require('../src/server/server');

describe('Server Tests', () => {
  before((done) => {
    this.port = 8081;
    this.SERVERURL = 'http://localhost:' + this.port;
    this.server = new Server(this.port);
    this.server.start();
    done();
  });

  after((done) => {
    this.server.end();
    done();
  });

  beforeEach((done) => {
    this.client = ioclient.connect(this.SERVERURL);
    this.client2 = ioclient.connect(this.SERVERURL);
    done();
  });

  afterEach((done) => {
    this.client.disconnect();
    this.client2.disconnect();
    done();
  });


  it('Users object should contain user after login', (done) => {
    let expected_username = "USERNAME1";
    this.client.emit('login', "PEERID", expected_username);

    this.client.on('login success', (username) => {

      var user = this.server.users[Object.keys(this.server.users)[0]];
      assert.equal(user.username, expected_username);
      done();

    });
  });

  it('Users object should not contain user after logout', (done) => {
    let expected_username = "USERNAME1";
    this.client.emit('login', "PEERID", expected_username);

    this.client.on('logout success', () => {
      assert.equal(null, this.server.getUserByUsername(expected_username));
      done();
    });

    this.client.on('login success', (username) => {
      this.client.emit('logout');
    });
  });
});