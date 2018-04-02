import React, { Component } from 'react';
import io from 'socket.io-client';

// var socket = io();
var socket2 = io('http://localhost:3000/loginLogout');

export default class App extends Component {
  render() {
    return (
      <h1>test</h1>
    );
  }
}