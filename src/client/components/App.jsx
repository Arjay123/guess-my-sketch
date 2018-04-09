import React, { Component } from 'react';
import io from 'socket.io-client';
import Lobby from './Lobby.jsx';

var socket = io();
// var socket2 = io('http://localhost:3000/loginLogout');

export default class App extends Component {
  render() {
    return (
      <Lobby socket={socket}/>
    );
  }
}