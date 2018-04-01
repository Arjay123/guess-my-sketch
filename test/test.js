let assert = require('assert');
let io = require('socket.io-client');

describe('Socket test', () => {
  it('Testing socket connect, should equal "testValue"', (done) => {
    let client = io.connect('http://localhost:3000');

    client.on('test', (data) => {
      assert.equal(data['testKey'], 'testValue');
      done();
      client.disconnect();
    });
  });
});