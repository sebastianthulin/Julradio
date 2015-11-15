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
        this.setState(body)
      }
    }).catch(console.error)
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