const React = require('react')
const {connect} = require('react-redux')
const User = require('../../../services/User')
const handleNotification = require('../../../services/handleNotification')
const UserProfile = require('./UserProfile')
const NotFound = require('../NotFound')
const {fetchUser} = require('../../../actions/users')
const {pullUnseenCount} = require('../../../actions/notifications')

@connect((state, props) => ({
  profile: state.users.getIn(['byUsername', props.params.username]),
  block: state.users.getIn(['blockByUsername', props.params.username]),
  onlineList: state.users.get('onlineList')
}), {
  onFetchUser: fetchUser,
  onPullUnseenCount: pullUnseenCount
})
class UserProfileContainer extends React.Component {
  shouldComponentUpdate(props, state) {
    return props.profile !== this.props.profile ||
      props.block !== this.props.block ||
      props.onlineList !== this.props.onlineList ||
      state.notFound !== this.state.notFound
  }

  componentWillMount() {
    this.state = {notFound: false}
    this.authedUser = User.get()
    this.fetch(this.props.params.username, 'profile block')
  }

  componentWillReceiveProps(props) {
    if (props.params.username !== this.props.params.username) {
      this.fetch(props.params.username, 'profile block')
    }
    if (props.params.username.toLowerCase() === (this.authedUser || {}).usernameLower) {
      this.props.onPullUnseenCount('wallPost', null)
    }
  }

  fetch(username, query) {
    this.props.onFetchUser(username, query).then(() => {
      this.setState({notFound: false})
    }).catch(() => {
      this.setState({notFound: true})
    })
  }

  render() {
    const {notFound} = this.state
    const {profile, block, onlineList} = this.props
    const profileId = profile && profile.get('_id')

    return notFound ? (
      <NotFound referingTo="Användaren" />
    ) : profile ? (
      <UserProfile
        key={profileId}
        user={profile}
        block={block}
        isOnline={onlineList.findIndex(user => user.get('_id') === profileId) > -1}
        showOptions={this.authedUser && this.authedUser._id !== profileId}
        onQuery={query => this.fetch(profile.get('username'), query)}
      />
    ) : null
  }
}

module.exports = UserProfileContainer
