const React = require('react')
const User = require('../../../services/User')
const CommentStore = require('../../../stores/CommentStore')
const NotificationStore = require('../../../stores/NotificationStore')
const Thread = require('./Thread')

class Comments extends React.Component {
  componentWillMount() {
    this.limit = 20
    this.user = User.get()
    this.admin = User.isAdmin()
    this.fetchComments()
  }

  fetchComments() {
    const limit = this.limit
    const {type, target} = this.props
    CommentStore.fetch(
      {type, target, limit},
      ({comments, totalThreads}) => this.setState({comments, totalThreads})
    )
  }

  post(ev) {
    ev.preventDefault()
    const {type, target} = this.props
    const text = this.refs.input.value.trim()
    if (!text) return
    CommentStore.post({type, target}, text, () => {
      this.refs.input.value = ''
      this.limit++
      this.fetchComments()
    })
  }

  renderForm() {
    const {user} = this
    const {block, placeholder, signInPlaceholder} = this.props
    const p = user
      ? placeholder || 'Skriv en kommentar'
      : signInPlaceholder || 'Logga in för att kommentera'

    return block ? null : (
      <form className="mainForm" onSubmit={this.post.bind(this)}>
        <textarea
          type="text"
          ref="input"
          placeholder={p}
          disabled={!user}
          maxLength={1000}
          className="clean"
        />
        <button className="btn">Skicka</button>
      </form>
    )
  }

  loadMore() {
    this.limit += 20
    this.fetchComments()
  }

  render() {
    const {user, admin} = this
    const {comments, totalThreads} = this.state || {}
    if (!comments) return null
    return (
      <div className="Comments">
        {this.renderForm()}
        {comments.map(({comment, replies}) => <Thread
          key={comment._id}
          comment={comment}
          replies={replies}
          onDelete={this.fetchComments.bind(this)}
          user={user}
          admin={admin}
        />)}
        {comments.length < totalThreads && (
          <button className="btn" onClick={this.loadMore.bind(this)}>
            Visa äldre meddelanden
          </button>
        )}
      </div>
    )
  }
}

module.exports = Comments
