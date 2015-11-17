const React = require('react')
const UserStore = require('../../../stores/UserStore')
const UserProfile = require('./UserProfile')

class UserProfileContainer extends React.Component {
  componentWillMount() {
    this.setUser(this.props.params.username)
  }

  componentWillReceiveProps(props) {
    this.setUser(props.params.username)
  }

  setUser(username) {
    this.execute(username, 'profile block')
  }

  runQuery(query) {
    this.execute(this.props.params.username, query)
  }

  execute(username, query) {
    UserStore.get(username, query).then(body => {
      if (this.props.params.username === username) {
        body.err = false
        this.setState(body)
      }
    }).catch(() => {
      this.setState({err: true})
    })
  }

  render() {
    const { profile, err } = this.state || {}
    return err ? (
      <div>404 or something</div>
    ) : profile ? <UserProfile
      key={profile._id}
      user={profile}
      onQuery={this.runQuery.bind(this)}
      {...this.state}
    /> : null
  }
}

module.exports = UserProfileContainer