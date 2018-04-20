import React from 'react';
import styles from './Chat.css';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    }

    let socket = this.props.socket;
    socket.on('chat message', (socketID, message) => {
      this.setState((prevState) => {
        return {
          messages: [...prevState.messages, {
            socketID: socketID,
            message: message
          }]
        };
      })
    });

    this.sendClicked = this.sendClicked.bind(this);
  }

  sendClicked() {
    this.props.socket.emit('chat message', this.messageInput.value);
    this.messageInput.value = '';
  }

  render() {

    let self = this;
    let messages = this.state.messages.map((message, index) =>
    {
      let user = self.props.users[message.socketID];
      console.log(message);
      console.log(user);
      console.log(self.props.users);
      return (
        <li className='message' key={index}>
          <span className='username' style={{ color: user._userAvatar.color}}>{user._username}</span> : <span className='text'>{message.message}</span>
        </li>
      );
    });

    return (
      <div className='chat-wrap'>
        <ul className='chat'>
          {messages}
        </ul>
        <div className='chat-ctrl'>
          <input ref={(messageInput) => {this.messageInput = messageInput}}/>
          <button onClick={this.sendClicked}>Send</button>
        </div>
      </div>
    );
  }
}