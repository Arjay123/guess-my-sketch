import React from 'react';
import styles from './Chat.css';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [
        {
          'username': 'Arjay',
          'message': 'Hi this is a message'
        },
        {
          'username': 'Mimi',
          'message': 'this is another message'
        },
        {
          'username': 'Arjay',
          'message': 'Lorem ipsum dolor sit amet, et ius quot timeam constituam, id tacimates splendide eum. Phaedrum conclusionemque an mei, harum choro iracundia ne sed. In cum offendit definitiones, forensibus neglegentur pri ad. Sed te meliore ceteros invidunt, per ea lorem movet. Nam ex nihil signiferumque, ius sint bonorum in, te natum argumentum quo. Ius iudicabit assentior an, pri id iudico semper facete.'
        },
        {
          'username': 'Arjay',
          'message': 'Lorem ipsum dolor sit amet, et ius quot timeam constituam, id tacimates splendide eum. Phaedrum conclusionemque an mei, harum choro iracundia ne sed. In cum offendit definitiones, forensibus neglegentur pri ad. Sed te meliore ceteros invidunt, per ea lorem movet. Nam ex nihil signiferumque, ius sint bonorum in, te natum argumentum quo. Ius iudicabit assentior an, pri id iudico semper facete.'
        },
        {
          'username': 'Arjay',
          'message': 'Lorem ipsum dolor sit amet, et ius quot timeam constituam, id tacimates splendide eum. Phaedrum conclusionemque an mei, harum choro iracundia ne sed. In cum offendit definitiones, forensibus neglegentur pri ad. Sed te meliore ceteros invidunt, per ea lorem movet. Nam ex nihil signiferumque, ius sint bonorum in, te natum argumentum quo. Ius iudicabit assentior an, pri id iudico semper facete.'
        },
        {
          'username': 'Arjay',
          'message': 'Lorem ipsum dolor sit amet, et ius quot timeam constituam, id tacimates splendide eum. Phaedrum conclusionemque an mei, harum choro iracundia ne sed. In cum offendit definitiones, forensibus neglegentur pri ad. Sed te meliore ceteros invidunt, per ea lorem movet. Nam ex nihil signiferumque, ius sint bonorum in, te natum argumentum quo. Ius iudicabit assentior an, pri id iudico semper facete.'
        },
        {
          'username': 'Arjay',
          'message': 'Lorem ipsum dolor sit amet, et ius quot timeam constituam, id tacimates splendide eum. Phaedrum conclusionemque an mei, harum choro iracundia ne sed. In cum offendit definitiones, forensibus neglegentur pri ad. Sed te meliore ceteros invidunt, per ea lorem movet. Nam ex nihil signiferumque, ius sint bonorum in, te natum argumentum quo. Ius iudicabit assentior an, pri id iudico semper facete.'
        },
        {
          'username': 'Arjay',
          'message': 'Lorem ipsum dolor sit amet, et ius quot timeam constituam, id tacimates splendide eum. Phaedrum conclusionemque an mei, harum choro iracundia ne sed. In cum offendit definitiones, forensibus neglegentur pri ad. Sed te meliore ceteros invidunt, per ea lorem movet. Nam ex nihil signiferumque, ius sint bonorum in, te natum argumentum quo. Ius iudicabit assentior an, pri id iudico semper facete.'
        }
      ]
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

    let messages = this.state.messages.map((message, index) =>
      <li className='message' key={index}>
        <span className='username'>{message.username}</span> : <span className='text'>{message.message}</span>
      </li>
    );

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