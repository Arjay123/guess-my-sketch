import React from 'react';
import styles from './Chat.css';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    }
    let self = this;
    let socket = this.props.socket;
    socket.on('chat message', (username, usercolor, message) => {
      this.setState((prevState) => {
        return {
          messages: [...prevState.messages, {
            username: username,
            usercolor: usercolor,
            message: message
          }]
        };
      }, () => {
        self.endMessage.scrollIntoView();
      });
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
      console.log(message);
      console.log(self.props.users);
      return (
        <li className='message' key={index}>
          <span className='username' style={{ color: message.usercolor}}>{message.username}</span> : <span className='text'>{message.message}</span>
        </li>
      );
    });

    messages.push(<div ref={(element) => {this.endMessage = element; }}/>);

    return (
      <div className='chat-wrap'>
        <ul className='chat'>
          {messages}
        </ul>
        <div className='chat-ctrl'>
          <textarea rows='2' className='ctrl-text' ref={(messageInput) => {this.messageInput = messageInput}}/>
          <button className='ctrl-btn' onClick={this.sendClicked}>Send</button>
        </div>
      </div>
    );
  }
}