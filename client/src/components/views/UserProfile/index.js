const React = require('react')
const User = require('../../../services/User')
const UserStore = require('../../../stores/UserStore')
const ShitStore = require('../../../stores/ShitStore')
const UserProfile = require('./UserProfile')
const NotFound = require('../NotFound')

class UserProfileContainer extends React.Component {
  componentWillMount() {
    this.authedUser = User.get()
    this.setUser(this.props.params.username)
  }

  componentWillReceiveProps(props) {
    this.setUser(props.params.username)
  }

  componentWillUnmount() {
    this.wallPostsOff()
  }

  setUser(username) {
    this.execute(username, 'profile block')
    const user = (this.authedUser || {}).usernameLower
    if (user === username.toLowerCase()) {
      ShitStore.clear('wallPost')
      // ShitStore.on('wallPost', () => true)
    } else {
      this.wallPostsOff()
    }
  }

  wallPostsOff() {
    // ShitStore.on('wallPost', () => false)
  }

  runQuery(query) {
    this.execute(this.props.params.username, query)
  }

  execute(username, query) {
    UserStore.get(username, query, body => {
      if (this.props.params.username === username) {
        body.err = false
        this.setState(body)
      }
    }, () => {
      this.setState({err: true})
    })
  }

  render() {
    const { profile, err } = this.state || {}
    return err ? (
      <NotFound referingTo={"Användaren"} />
    ) : profile ? <UserProfile
      key={profile._id}
      user={profile}
      authedUser={this.authedUser}
      onQuery={this.runQuery.bind(this)}
      {...this.state}
    /> : null
  }
}

module.exports = UserProfileContainer