const assert = require('assert');
const io = require('socket.io-client');

const SERVER = 'http://localhost:3000';


describe('Login Tests', () => {
  beforeEach(() => {
    this.client = io.connect(SERVER);
    this.client2 = io.connect(SERVER);
  });

  afterEach(() => {
    this.client.disconnect();
    this.client2.disconnect();
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