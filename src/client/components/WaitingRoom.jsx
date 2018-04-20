import React from 'react';
import styles from './WaitingRoom.css';

const MAX_USERS = 8;

export default class WaitingRoom extends React.Component {
  constructor(props) {
    super(props);

    this.loginClicked = this.loginClicked.bind(this);
    this.startClicked = this.startClicked.bind(this);
  }

  loginClicked() {
    this.props.handleLoginClicked(this.usernameInput.value);
  }


  getUserColor(userNumber) {
    if (userNumber < this.props.colors.length) {
      return this.props.colors[userNumber];
    }
  }

  startClicked() {
    this.props.startGame();
  }

  render() {

    let users = [];

    for (var userID in this.props.users) {
      let user = this.props.users[userID];
      users.push(
        (<div
          className='username-wrap'
          style={{backgroundColor: user._userAvatar.color}}
          key={userID}>
            <p className='username'>{user._username}</p>
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
        <button onClick={this.startClicked}>Start</button>
      </div>
    );
  }
}