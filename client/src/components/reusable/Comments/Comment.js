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
    const {comment, user} = this.props
    const commentUser = comment.get('user')
    return (
      <div className="Comment">
        <ProfilePicture id={commentUser.get('picture')} />
        <div className="content">
          <header>
            <Link to={'/@' + commentUser.get('username')}>{commentUser.get('username')}</Link>
            <TimeSince date={comment.get('date')} />
          </header>
          <MDMini
            className="text"
            text={comment.get('text')}
            username={user && user.username}
          />
          {this.removable && <button className="delete" onClick={this.delete.bind(this)}>x</button>}
        </div>
      </div>
    )
  }
}

module.exports = Comment
