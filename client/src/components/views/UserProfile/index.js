const React = require('react')
const {connect} = require('react-redux')
const User = require('../../../services/User')
const UserStore = require('../../../stores/UserStore')
const handleNotification = require('../../../services/handleNotification')
const UserProfile = require('./UserProfile')
const NotFound = require('../NotFound')
const {pullUnseenCount} = require('../../../actions/notifications')

@connect(state => ({
  onlineList: state.onlineList
}), {
  onPullUnseenCount: pullUnseenCount
})
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
    const user = (this.authedUser || {}).usernameLower
    if (user === username.toLowerCase()) {
      this.props.onPullUnseenCount('wallPost', null)
      // handleNotification.on('wallPost', () => true)
    } else {
      this.wallPostsOff()
    }
  }

  wallPostsOff() {
    // handleNotification.on('wallPost', () => false)
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
    const {onlineList} = this.props
    const {profile, err} = this.state || {}
    return err ? (
      <NotFound referingTo="Användaren" />
    ) : profile ? (
      <UserProfile
        key={profile._id}
        user={profile}
        isOnline={onlineList.findIndex(user => user.get('_id') === profile._id) > -1}
        authedUser={this.authedUser}
        onQuery={this.runQuery.bind(this)}
        {...this.state}
      />
    ) : null
  }
}

module.exports = UserProfileContainer
