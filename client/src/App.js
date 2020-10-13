import React, { Component } from 'react';
import './App.css';
const axios = require('axios');

class App extends Component {
  state = {users: []};
  componentDidMount() {
    axios.get('/api/users')
      .then((response) => {
        this.setState({users: response.data})
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  render() {
    return (
      <div className="App">
        <h1>Users</h1>
        {this.state.users.map(user =>
          <div key={user.id}>{user.firstname}</div>
        )}
      </div>
    );
  }
}

export default App;
