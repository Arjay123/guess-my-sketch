import React, { Component } from 'react';
import io from 'socket.io-client';
import Lobby from './Lobby.jsx';
import Room from './Room.jsx';
import styles from './App.css';

// var socket2 = io('http://localhost:3000/loginLogout');

export default class App extends Component {
  constructor(props) {
    super(props);

    this.socket = io();

    this.state = {
      room: 'lobby',
      roomcode: ''
    }

    this.joinNamespace = this.joinNamespace.bind(this);
  }

  joinNamespace(endpoint) {
    console.log(`Joining ${endpoint}`);
    this.socket = io(`/${endpoint}`);
    this.setState({
      'room': 'waitingRoom',
      'roomcode': endpoint
    });
  }

  render() {

    var room;
    if (this.state.room === 'lobby') {
      room = (
        <Lobby
          socket={this.socket}
          joinNamespace={this.joinNamespace}
        />
      );
    }
    else {
      room = (
        <Room
          socket={this.socket}
          roomcode={this.state.roomcode}
        />
      );
    }

    return (
      <div className='app'>
        {room}
      </div>
    );
  }
}