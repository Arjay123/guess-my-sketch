import React from 'react';
import WaitingRoom from './WaitingRoom.jsx';
import Chat from './Chat.jsx';
import Canvas from './Canvas.jsx';
import styles from './Room.css';

export default class Room extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'waiting',
      users: {}
    }

    let socket = this.props.socket;

    socket.on('user list', (usernames) => {
      this.setState({
        'users': usernames
      }, () => {
        console.log(this.state.users);
      });
    });

    socket.on('login fail', (error) => {
      console.log(`Failed to login: ${error}`);
    });

    socket.on('login success', (username) => {
      console.log(`Successfully logged in with ${username}`);
    });

    socket.on('start game', () => {
      this.setState({
        status: 'game'
      });
    });

    this.login = this.login.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  login(username) {
    this.props.socket.emit('login', "PEERID", username);
  }

  startGame() {
    this.props.socket.emit('start game');
  }

  render() {

    let content = <WaitingRoom
                    socket={this.props.socket}
                    users={this.state.users}
                    handleLoginClicked={this.login}
                    roomcode={this.props.roomcode}
                    colors={this.state.colors}
                    startGame={ this.startGame }
                  />;
    if (this.state.status === 'game') {
      content = [
        <Canvas key='canvas' socket={this.props.socket} />,
        <Chat key='chat' socket={this.props.socket} users={this.state.users}/>
      ];
    }


    return (
      <div className='room'>
        { content }
      </div>
    );
  }
}