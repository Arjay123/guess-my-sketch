import React from 'react';
import WaitingRoom from './WaitingRoom.jsx';
import Chat from './Chat.jsx';
import Canvas from './Canvas.jsx';
import styles from './Room.css';

export default class Room extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'game',
      users: []
    }

    let socket = this.props.socket;

    socket.on('username list', (usernames) => {
      this.setState({
        'users': usernames
      });
    });

    socket.on('login fail', (error) => {
      console.log(`Failed to login: ${error}`);
    });

    socket.on('login success', (username) => {
      console.log(`Successfully logged in with ${username}`);
    });

    this.login = this.login.bind(this);
  }

  login(username) {
    this.props.socket.emit('login', "PEERID", username);
  }

  render() {

    let content = <WaitingRoom
                    socket={this.props.socket}
                    users={this.state.users}
                    handleLoginClicked={this.login}
                    roomcode={this.props.roomcode}
                  />;
    if (this.state.status === 'game') {
      content = [
        <Canvas key='canvas' socket={this.props.socket} />,
        <Chat key='chat' socket={this.props.socket} />
      ];
    }


    return (
      <div className='room'>
        { content }
      </div>
    );
  }
}