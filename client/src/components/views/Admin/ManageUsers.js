const React = require('react')
const { Link } = require('react-router')
const UserStore = require('../../../stores/UserStore')
const ManageUser = require('./ManageUser')

const User = ({ username, admin, crew }) => (
  <tr>
    <td><Link to={`/admin/users/${username}`}>{username}</Link></td>
    <td>{admin.toString()}</td>
    <td>{crew.toString()}</td>
  </tr>
)

class ManageUsers extends React.Component {
  componentWillMount() {
    this.setUser(this.props.params.username)
    UserStore.getAll(users => {
      this.users = users
      this.reduce(users)
    })
  }

  componentWillReceiveProps(props) {
    this.setUser(props.params.username)
  }

  setUser(username) {
    UserStore.getByUsername(username, selectedUser => this.setState({ selectedUser }))
  }

  filter(ev) {
    const query = ev.target.value.toLowerCase()
    const users = this.users.filter(user => user.username.toLowerCase().indexOf(query) > -1)
    this.reduce(users)
  }

  reduce(users) {
    users = users.slice(0, 10)
    this.setState({ users })
  }

  render() {
    const { users, selectedUser } = this.state || {}
    return (
      <div className="ten columns">
        <div className="one-half column">
          <input type="text" placeholder="Sök..." onChange={this.filter.bind(this)} />
          <table>
            <tbody>
              <tr>
                <th>Användarnamn</th>
                <th>Admin</th>
                <th>Crew</th>
              </tr>
              {users && users.map(user => <User key={user._id} {...user} />)}
            </tbody>
          </table>
          {users && this.users.length + ' användare'}
          {!users && 'Laddar...'}
        </div>
        {selectedUser && <ManageUser key={selectedUser._id} user={selectedUser} />}
      </div>
    )
  }
}

module.exports = ManageUsers