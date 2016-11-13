const React = require('react')
const {Link} = require('react-router')
const ProfilePicture = require('../ProfilePicture')
const TimeSince = require('../TimeSince')
const MDMini = require('../MDMini')

class Comment extends React.Component {
  componentWillMount() {
    const {comment, user, admin} = this.props
    const userId = user && user._id
    this.removable = admin || userId === comment.getIn(['user', '_id']) || userId === comment.get('owner')
  }

  delete() {
    if (confirm('Ta bort inlägg?')) {
      this.props.onDelete(this.props.comment.get('_id'))
    }
  }

  render() {
    const {comment} = this.props
    const user = comment.get('user')
    return (
      <div className="Comment">
        <ProfilePicture id={user.get('picture')} />
        <div className="content">
          <header>
            <Link to={'/@' + user.get('username')}>{user.get('username')}</Link>
            <TimeSince date={comment.get('date')} />
          </header>
          <MDMini className="text" text={comment.get('text')} />
          {this.removable && <button className="delete" onClick={this.delete.bind(this)}>x</button>}
        </div>
      </div>
    )
  }
}

module.exports = Comment
