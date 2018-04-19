import React from 'react';
import styles from './WaitingRoom.css';

const MAX_USERS = 8;

export default class WaitingRoom extends React.Component {
  constructor(props) {
    super(props);

    this.loginClicked = this.loginClicked.bind(this);

    this.state = {
      colors: [
        'lightblue',
        'lightcoral',
        'lightgreen',
        'lightpink',
        'lightsalmon',
        'lightseagreen',
        'lightsteelblue',
        'lightslategray'
      ]
    };
  }

  loginClicked() {
    this.props.handleLoginClicked(this.usernameInput.value);
  }

  getNextColor(currentColor) {
    let color = null;
    if (currentColor < this.state.colors.length) {
      color = this.state.colors[currentColor];
    }
    return color;
  }

  render() {

    let users = [];

    for (var index = 0; index < MAX_USERS; index++) {
      let username = null;
      if (index < this.props.users.length) {
        username = this.props.users[index];
      }
      let color = this.getNextColor(index);
      users.push(
        (<div
          className='username-wrap'
          style={{backgroundColor: color}}
          key={index}>
            <p className='username'>{username}</p>
        </div>)
      );
    }

    return(
      <div className='waiting-room'>
        <div className='section title'>
          <div className='header'>
            <h1>Guess My Sketch</h1>
            <p>Welcome!</p>
            <p>Your room code is</p>
            <div className='roomcode'>{this.props.roomcode}</div>
          </div>
          <div className='input-wrap'>
            <h2>Enter your username</h2>
            <input className='username-input' ref={(usernameInput) => {this.usernameInput = usernameInput }}></input>
            <button className='waiting-room-btn' onClick={this.loginClicked}>Login</button>
          </div>
        </div>
        <div className='section userlist'>
          {users}
        </div>
      </div>
    );
  }
}