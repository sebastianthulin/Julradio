const React = require('react')
const UserStore = require('../../stores/UserStore')

class Settings extends React.Component {
  componentWillMount() {
    this.unsub = UserStore.subscribe(user => this.setState({ user }))
  }

  componentWillUnmount() {
    this.unsub()
  }

  render() {
    const { user } = this.state
    return (
      <div className="row content">
        <div>
          <h6>Email</h6>
          <input type="text" defaultValue={user.email} />
        </div>
        <div>
          <h6>Description</h6>
          <textarea defaultValue={user.description} />
        </div>
      </div>
    )
  }
}

module.exports = Settings