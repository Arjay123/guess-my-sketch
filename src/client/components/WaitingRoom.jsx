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
          className='username'
          style={{backgroundColor: color}}
          key={index}>
            {username}
        </div>)
      );
    }
    // let users = this.props.users.map((username) => {
    //   let color = this.getNextColor(currentColor++);
    //   return (
    //       <div
    //         className='username'
    //         style={{backgroundColor: color}}
    //         key={username}>
    //           {username}
    //       </div>
    //     );
    // });

    return(
      <div className='waiting-room'>
        <div className='section title'>
          <h1>WaitingRoom</h1>
          <h3>Enter your username</h3>
          <input ref={(usernameInput) => {this.usernameInput = usernameInput }}></input>
          <button className='waiting-room-btn' onClick={this.loginClicked}>Login</button>
        </div>
        <div className='section userlist'>
          {users}
        </div>
      </div>
    );
  }
}