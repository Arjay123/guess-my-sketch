const assert = require('assert');
const io = require('socket.io-client');

const Server = require('../src/server/server');


describe('Client Tests', () => {
  before((done) => {
    this.port = 8080;
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
    this.client = io.connect(this.SERVERURL);
    this.client2 = io.connect(this.SERVERURL);
    done();
  });

  afterEach((done) => {
    this.client.disconnect();
    this.client2.disconnect();
    done();
  })

  //Test successful login
  it('Successful login, should equal "USERNAME1"', (done) => {
    let expected_username = 'USERNAME1';
    let err = true;

    this.client.emit('login', "PEERID", expected_username);

    this.client.on('login success', (actual_username) => {
      try {
        assert.equal(actual_username, expected_username);
        done();
      }
      catch (e) {
        if (e instanceof assert.AssertionError)
          done(e);
      }
    });
  });

  //Test failed login
  it('Failed login, "USERNAME1" already in use', (done) => {

    let username = "USERNAME1";

    this.client.emit('login', "PEERID", username);
    this.client2.emit('login', "PEERID", username);

    this.client2.on('login success', (actual_username) => {
      done(`Error, ${actual_username} should be taken`);
    });

    this.client2.on('login fail', (message) => {
      done();
    });
  });
});