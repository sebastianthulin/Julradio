const React = require('react')
const { Link } = require('react-router')
const UserStore = require('../../../stores/UserStore')
const ManageUser = require('./ManageUser')

const User = ({ username, roles, banned }) => (
  <tr>
    <td><Link to={`/admin/users/${username}`}>{username}</Link></td>
    <td>{roles.admin.toString()}</td>
    <td>{roles.writer.toString()}</td>
    <td>{roles.radioHost.toString()}</td>
    <td>{(!!banned).toString()}</td>
  </tr>
)

class ManageUsers extends React.Component {
  componentWillMount() {
    this.state = {limit: 20}
    this.setUser(this.props.params.username)
    UserStore.getAll(users => {
      this.userList = users
      this.setState({ users })
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
    const { users, selectedUser, limit } = this.state
    const userNodes = []

    for (let i = 0; i < limit; i++) {
      const user = (users || [])[i]
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