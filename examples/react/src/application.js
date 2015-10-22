const React = require('react');
const ReactDOM = require('react-dom');
const m = require('mandolin');
const { None, Some } = m;
const users = require('./users.json');
const User = require('./User');

const UserRow = React.createClass({
  render () {
    return (
      <tr>
        <td>{ this.props.user.firstName.getOrElse("") }</td>
        <td>{ this.props.user.lastName.getOrElse("") }</td>
      </tr>
    );
  }
});

/**
 * Stub out fetch 
 * @return {[type]} [description]
 */
const fetch = function(){
  return new Promise(function(resolve, reject){
    setTimeout(() => resolve(users), 1000);
  });
};

const App = React.createClass({
  getInitialState () {
    return { users: new None() };
  },
  componentDidMount () {
    fetch().then((data) => {
      return data.map(User.create)
    })
    .then((users) => {
      debugger
    })
  },
  render () {
    return (
      <div>
        <h1>User Manager</h1>
        {
          this.state.users.map((users) => {
            return (
              <table>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    users.map((user, i) => <UserRow user={user} key={i} />)
                  }
                </tbody>
              </table>
            );
          }).getOrElse(() => {
            return <p>Loading...</p>;
          })
        }
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById("app"));