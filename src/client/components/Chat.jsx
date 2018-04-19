import React from 'react';
import styles from './Chat.css';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    }

    let socket = this.props.socket;
    socket.on('chat message', (username, message) => {
      this.setState((prevState) => {
        return {
          messages: [...prevState.messages, {
            username: username,
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

    let messages = this.state.messages.map((message) => <li>{message.username + ': ' + message.message}</li>);

    return (
      <div className='chat'>
        <h1>Chat</h1>
        <ul>
          {messages}
        </ul>
        <input ref={(messageInput) => {this.messageInput = messageInput}}/>
        <button onClick={this.sendClicked}>Send</button>
      </div>
    );
  }
}