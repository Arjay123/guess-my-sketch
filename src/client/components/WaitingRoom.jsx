import React from 'react';

export default class WaitingRoom extends React.Component {
  constructor(props) {
    super(props);

    this.loginClicked = this.loginClicked.bind(this);
  }

  loginClicked() {
    this.props.handleLoginClicked(this.usernameInput.value);
  }

  render() {
    let users = this.props.users.map((username) =>
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