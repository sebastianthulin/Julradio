const React = require('react')
const {connect} = require('react-redux')
const handleNotification = require('../../../services/handleNotification')
const UserProfile = require('./UserProfile')
const NotFound = require('../NotFound')
const {fetchUser} = require('../../../actions/users')
const {blockUser, unblockUser} = require('../../../actions/account')
const {pullUnseenCount} = require('../../../actions/notifications')
const selectors = require('../../../selectors')

@connect((state, props) => ({
  authedUser: selectors.user(state),
  isAdmin: selectors.isAdmin(state),
  profile: state.users.getIn(['byUsername', props.params.username.toLowerCase()]),
  block: state.users.getIn(['blockByUsername', props.params.username.toLowerCase()]),
  onlineList: state.users.get('onlineList'),
}), {
  onFetchUser: fetchUser,
  onPullUnseenCount: pullUnseenCount,
  onBlockUser: blockUser,
  onUnblockUser: unblockUser
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
    this.fetch(this.props.params.username, 'profile block')
  }

  componentWillReceiveProps(props) {
    if (props.params.username !== this.props.params.username) {
      this.fetch(props.params.username, 'profile block')
    }
    if (props.params.username.toLowerCase() === (props.authedUser || {}).usernameLower) {
      this.props.onPullUnseenCount('wallPost', null)
    }
  }

  fetch(username, query) {
    this.props.onFetchUser(username, query).then(err => {
      const notFound = !!err
      notFound !== this.state.notFound && this.setState({notFound})
    })
  }

  render() {
    const {props} = this
    const {notFound} = this.state
    const {authedUser, profile, block, onlineList} = props
    const profileId = profile && profile.get('_id')

    return notFound ? (
      <NotFound referingTo="Användaren" />
    ) : profile ? (
      <UserProfile
        key={profileId}
        user={profile}
        block={block}
        isOnline={onlineList.findIndex(user => user.get('_id') === profileId) > -1}
        showOptions={authedUser && authedUser._id !== profileId}
        onQuery={query => this.fetch(profile.get('username'), query)}
        onBlockUser={props.onBlockUser}
        onUnblockUser={props.onUnblockUser}
        isAdmin={props.isAdmin}
      />
    ) : null
  }
}

module.exports = UserProfileContainer
