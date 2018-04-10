import React from 'react';

export default class WaitingRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    }

    let socket = this.props.socket;

    socket.on('username list', (usernames) => {
      this.setState({
        'users': usernames
      });
    });

    socket.on('login fail', (error) => {
      console.log(`Failed to login: ${message}`);
    });

    socket.on('login success', (username) => {
      console.log(`Successfully logged in with ${username}`);
    });

    this.loginClicked = this.loginClicked.bind(this);
  }

  loginClicked() {
    this.props.socket.emit('login', "PEERID", this.usernameInput.value);
  }

  render() {

    let users = this.state.users.map((username) =>
      <li>{username}</li>
    );

    return(
      <div className='waiting-room'>
        <h1>WaitingRoom</h1>
        <h3>Enter your username</h3>
        <input ref={(usernameInput) => {this.usernameInput = usernameInput }}></input>
        <button className='waiting-room-btn' onClick={this.loginClicked}>Login</button>

        <h3>Other Users</h3>
        <ul>
          {users}
        </ul>
      </div>
    );
  }
}