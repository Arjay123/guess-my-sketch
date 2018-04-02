const assert = require('assert');
const io = require('socket.io-client');

const Server = require('../src/server/server');


describe('Login/Logout Tests', () => {
  before((done) => {
    this.port = 8080;
    this.SERVERURL = 'http://localhost:' + this.port +'/loginLogout';
    this.server = new Server(this.port);
    this.server.start();
    this.server.createNamespace('loginLogout');
    this.ns = this.server.namespaces['loginLogout'];
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
  })

  // Client Tests
  // Test Login success
  it('Client: Successful login, should receive "USERNAME1"', (done) => {
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

  // Test failed login
  it('Client: Failed login, should fire login fail event', (done) => {
    let username = "USERNAME1";
    let taken = false;
    this.client.emit('login', "PEERID", username);
    this.client2.emit('login', "PEERID", username);

    let loginCallback = () => {
      if(taken)
        done(`Error, ${actual_username} should be taken`);
      taken = true;
    }

    this.client.on('login success', (actual_username) => loginCallback);
    this.client2.on('login success', (actual_username) => loginCallback);

    this.client.on('login fail', (message) => done());
    this.client2.on('login fail', (message) => done());
  });

  it('Server: Users object should contain user after login', (done) => {
    let expected_username = "USERNAME1";
    this.client.emit('login', "PEERID", expected_username);

    this.client.on('login success', (username) => {

      var user = this.ns.getUserByUsername(expected_username);
      assert.equal(user.username, expected_username);
      done();

    });
  });

  it('Server: Users object should not contain user after logout', (done) => {
    let expected_username = "USERNAME1";
    this.client.emit('login', "PEERID", expected_username);

    this.client.on('logout success', () => {
      assert.equal(null, this.ns.getUserByUsername(expected_username));
      done();
    });

    this.client.on('login success', (username) => {
      this.client.emit('logout');
    });
  });


});