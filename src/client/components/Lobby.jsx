import React from 'react';
import styles from './Lobby.css';
import Modal from './Modal.jsx';

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: true,
      status: '',
      endpoint: ''
    }

    //Lobby event listeners for SocketIO
    let socket = this.props.socket;
    socket.on('namespace not found', (endpoint) => {
      console.log('Room ' + endpoint + ' not found');
      let self = this;
      this.setState({
        showModal: true,
        status: 'namespace not found',
        endpoint: endpoint
      });
    });

    socket.on('namespace created', (endpoint) => {
      console.log('Room ' + endpoint + ' created');
      let self = this;
      this.setState({
        showModal: true,
        status: 'namespace created',
        endpoint: endpoint
      }, () => setTimeout(function() {self.props.joinNamespace(endpoint)}, 1000));
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
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.setState({
      showModal: false
    });
  }

  joinClicked() {
    let roomcode = this.roomcodeInput.value;

    this.setState({
      showModal: true,
      status: 'join namespace',
      endpoint: roomcode
    });


    setTimeout(() => {this.props.socket.emit('join namespace', roomcode)}, 1000);
  }

  createClicked() {
    this.setState({
      showModal: true,
      status: 'create namespace'
    });

    setTimeout(() => {this.props.socket.emit('create namespace')}, 1000);
  }

  render() {
    let modal = null;

    if (this.state.showModal) {
      if (this.state.status === 'create namespace') {
        modal = (
          <Modal>
            <span>Creating room...</span>
            <button onClick={this.closeModal}>Cancel</button>
          </Modal>
        );
      } else
      if (this.state.status === 'namespace created') {
        modal = (
          <Modal>
            <span>Room: {this.state.endpoint} created, joining now</span>
            <button onClick={this.closeModal}>Cancel</button>
          </Modal>
        );
      } else
      if (this.state.status === 'namespace not found') {
        modal = (
          <Modal>
            <span>Room: {this.state.endpoint} not found</span>
            <button onClick={this.closeModal}>OK</button>
          </Modal>
        );
      } else
      if (this.state.status === 'join namespace') {
        modal = (
          <Modal>
            <span>Joining Room: {this.state.endpoint}</span>
            <button onClick={this.closeModal}>Cancel</button>
          </Modal>
        );
      }
    }

    return (
      <div className='lobby-wrap'>
        <div className='lobby'>
          <div className='lobby-hdr'>
            <h1>Welcome to Guess My Sketch</h1>
            <h3>Join a room by entering a 6 character room code or create a new one</h3>
          </div>
          <div className='lobby-body'>
            <input className='lobby-txt' ref={(roomcodeInput) => { this.roomcodeInput = roomcodeInput }}></input>
            <div className='btn-wrap'>
              <button className='lobby-btn' onClick={this.joinClicked}>Join Room</button>
              <button className='lobby-btn' onClick={this.createClicked}>Create Room</button>
            </div>
          </div>
        </div>
        { modal }
      </div>
    );
  }


}