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
    UserStore.get(username, 'profile block wallposts')
      .then(body => this.setState(body))
      .catch(console.log)
  }

  runQuery(query) {
    UserStore.get(this.props.params.username, query)
      .then(body => this.setState(body))
      .catch(console.log)
  }

  render() {
    const { profile } = this.state || {}
    return profile ? <UserProfile
      key={profile._id}
      user={profile}
      onQuery={this.runQuery.bind(this)}
      {...this.state}
    /> : null
  }
}

module.exports = UserProfileContainer