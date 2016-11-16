const React = require('react')
const request = require('superagent')
const {connect} = require('react-redux')
const {Link} = require('react-router')
const ManageUser = require('./ManageUser')
const {getUserByUsername} = require('../../../actions/users')

const getAllUsers = cb => {
  request.get('/api/user/all').then(({body: users}) => {
    users.forEach(user => user.usernameLower = user.username.toLowerCase())
    users.sort((a, b) => {
      if (a.usernameLower < b.usernameLower) return -1
      if (a.usernameLower > b.usernameLower) return 1
      return 0
    })
    cb(users)
  })
}

const User = ({username, roles, banned}) => (
  <tr>
    <td><Link to={`/admin/users/${username}`}>{username}</Link></td>
    <td>{roles.admin ? 'Ja' : ''}</td>
    <td>{roles.writer ? 'Ja' : ''}</td>
    <td>{roles.radioHost ? 'Ja' : ''}</td>
    <td>{banned ? 'Ja' : ''}</td>
  </tr>
)

@connect(null, {
  getUserByUsername
})
class ManageUsers extends React.Component {
  componentWillMount() {
    this.state = {limit: 20}
    this.setUser(this.props.params.username)
    getAllUsers(users => {
      this.userList = users
      this.setState({users})
    })
  }

  componentWillReceiveProps(props) {
    this.setUser(props.params.username)
  }

  setUser(username) {
    this.props.getUserByUsername(username).then(selectedUser => this.setState({selectedUser}))
  }

  filter(ev) {
    const query = ev.target.value.toLowerCase()
    const users = this.userList.filter(user => user.usernameLower.indexOf(query) > -1)
    this.setState({
      users,
      limit: 20
    })
  }

  showMore() {
    this.setState({
      limit: this.state.limit + 20
    })
  }

  render() {
    const {users, selectedUser, limit} = this.state
    const userNodes = []

    for (let i = 0; i < limit; i++) {
      const user = (users || [])[i]
      if (user) {
        userNodes.push(<User key={user._id} {...user} />)
      }
    }

    return (
      <div id="ManageUsers">
        <h3>Konton</h3>
        <div className="row">
          <div className="oneHalf column">
            <input className="goodSearch" type="text" placeholder="Sök..." onChange={this.filter.bind(this)} />
            <table>
              <tbody>
                <tr>
                  <th>Användarnamn</th>
                  <th>Admin</th>
                  <th>Skribent</th>
                  <th>Radiopratare</th>
                  <th>Bannad</th>
                </tr>
                {userNodes}
              </tbody>
            </table>
            <br />
            <button className="btn" onClick={this.showMore.bind(this)}>Visa fler</button>
            {users && this.userList.length + ' användare'}
            {!users && 'Laddar...'}
          </div>
          {selectedUser && <ManageUser key={selectedUser._id} user={selectedUser} />}
        </div>
      </div>
    )
  }
}

module.exports = ManageUsers
