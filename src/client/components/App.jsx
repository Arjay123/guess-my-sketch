import React, { Component } from 'react';
import io from 'socket.io-client';
import Lobby from './Lobby.jsx';
import WaitingRoom from './WaitingRoom.jsx';

// var socket2 = io('http://localhost:3000/loginLogout');

export default class App extends Component {
  constructor(props) {
    super(props);

    this.socket = io();

    this.state = {
      'room': 'lobby'
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

    let room = (
      <Lobby
        socket={this.socket}
        joinNamespace={this.joinNamespace}
      />
    );

    if (this.state.room === 'waitingRoom') {
      room = (
        <WaitingRoom
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