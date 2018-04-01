import React, { Component } from 'react';
import io from 'socket.io-client';

var socket = io();

export default class App extends Component {
  render() {
    return (
      <h1>test</h1>
    );
  }
}