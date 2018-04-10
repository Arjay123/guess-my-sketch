import React from 'react';

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);

    //Lobby event listeners for SocketIO
    let socket = this.props.socket;
    socket.on('namespace not found', (endpoint) => {
      console.log('Room ' + endpoint + ' not found');
    });

    socket.on('namespace created', (endpoint) => {
      console.log('Room ' + endpoint + ' created');
    });

    socket.on('join namespace', (endpoint) => {
      console.log('Room ' + endpoint + ' found');
      this.props.joinNamespace(endpoint);
    });

    socket.on('namespaces full', () => {
      console.log('No more space for new rooms');
    });

    this.joinClicked = this.joinClicked.bind(this);
    this.createClicked = this.createClicked.bind(this);
  }

  joinClicked() {
    let roomcode = this.roomcodeInput.value;
    this.props.socket.emit('join namespace', roomcode);
  }

  createClicked() {
    this.props.socket.emit('create namespace');
  }

  render() {
    return (
      <div className='lobby'>
        <h1>Lobby</h1>
        <input ref={(roomcodeInput) => { this.roomcodeInput = roomcodeInput }}></input>
        <button className='lobby-btn' onClick={this.joinClicked}>Join Room</button>
        <button className='lobby-btn' onClick={this.createClicked}>Create Room</button>
      </div>
    );
  }


}