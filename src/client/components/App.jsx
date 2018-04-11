import React, { Component } from 'react';
import io from 'socket.io-client';
import Lobby from './Lobby.jsx';
import Room from './Room.jsx';

// var socket2 = io('http://localhost:3000/loginLogout');

export default class App extends Component {
  constructor(props) {
    super(props);

    this.socket = io();

    this.state = {
      room: 'lobby'
    }

    this.joinNamespace = this.joinNamespace.bind(this);
  }

  joinNamespace(endpoint) {
    console.log(`Joining ${endpoint}`);
    this.socket = io(`/${endpoint}`);
    this.setState({
      'room': 'waitingRoom'
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