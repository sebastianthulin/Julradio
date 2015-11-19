const React = require('react')
const { Link } = require('react-router')
const User = require('../../services/User')
const history = require('../../services/history')
const CommentStore = require('../../stores/CommentStore')
const ProfilePicture = require('./ProfilePicture')
const TimeSince = require('./TimeSince')
const Comment = require('./Comment')

class Thread extends React.Component {

  componentWillMount() {
    const { replies, comment } = this.props
    this.handleReplies({replies, comment})
    this.setState({ showReply: false })
  }

  delete() {
    const { comment } = this.state
    const { onDelete } = this.props
    if (!confirm('Ta bort inlägg?')) return
    CommentStore.deleteComment(comment._id).then(onDelete).catch(err => {
      console.error(err)
      alert('Något gick fel')
    })
  }

  handleReplies({comment, replies}) {
    this.setState({ comment, replies })
  }

  fetchReplies(limit) {
    const { comment } = this.props
    CommentStore.fetchReplies(comment._id, limit).then(this.handleReplies.bind(this)).catch(err => {
      console.log(err)
      alert('Något gick fel')
    })
  }

  reply(ev) {
    ev.preventDefault()
    const { replies, comment } = this.state

    const text = this.refs.reply.value.trim()
    if (!text) return
    CommentStore.reply(comment._id, text).then(() => {
      this.refs.reply.value = ''
      this.toggleReply()
      this.fetchReplies(replies ? replies.length + 1 : 1)
    }).catch(err => {
      console.error(err)
      alert('Något gick fel')
    })
  }

  renderReplies() {
    const { replies } = this.state
    const { onDelete, user, admin } = this.props
    return (
      <div>
        {replies.map(reply => <Comment
          key={reply._id}
          comment={reply}
          onDelete={this.fetchReplies.bind(this, replies.length)}
          user={user}
          admin={admin}
        />)}
      </div>
    )
  }

  toggleReply() {
    const { showReply } = this.state
    this.setState({ showReply: !showReply })
  }

  render() {
    const { showReply, replies, comment } = this.state
    const {user, admin } = this.props
    return (
      <div className="Thread">
        <Comment
          key={comment._id}
          comment={comment}
          onDelete={this.delete.bind(this)}
          user={user}
          admin={admin}
        />
        <div className="options">
          <span onClick={this.toggleReply.bind(this)} className="option">Svara</span>
          {replies && comment.numReplies > replies.length && <span onClick={this.fetchReplies.bind(this)} className="option">Visa alla {comment.numReplies} svar</span>}
        </div>
        {showReply && <form className="reply" onSubmit={this.reply.bind(this)}>
          <input ref="reply" className="replyInput" placeholder="Svara" />
        </form>}
        {this.removable && <button className="delete" onClick={this.delete.bind(this)}>x</button>}
        {replies && <div className="replies">{this.renderReplies()}</div>}
      </div>
    )
  }
}

class Comments extends React.Component {
  componentWillMount() {
    this.user = User.get()
    this.admin = User.isAdmin()
    this.fetchComments()
  }

  fetchComments() {
    const { type, target } = this.props
    CommentStore.fetch({ type, target }, comments => this.setState({ comments }))
  }

  post(ev) {
    ev.preventDefault()
    const { type, target } = this.props
    const text = this.refs.input.value.trim()
    if (!text) return
    CommentStore.post({ type, target }, text).then(() => {
      this.refs.input.value = ''
      this.fetchComments()
    }).catch(err => {
      console.error(err)
      alert('något gick fel.')
    })
  }

  renderForm() {
    const { block, placeholder } = this.props
    return block ? null : (
      <form className="mainForm" onSubmit={this.post.bind(this)}>
        <textarea
          type="text"
          ref="input"
          placeholder={placeholder || 'Skriv en kommentar'}
          maxLength={1000}
        />
        <button className="btn">Skicka</button>
      </form>
    )
  }

  render() {
    const { user, admin } = this
    const { comments } = this.state || {}
    if (!comments) return null
    return (
      <div className="Comments">
        {this.renderForm()}
        {comments.map(({ comment, replies }) => <Thread
          key={comment._id}
          comment={comment}
          replies={replies}
          onDelete={this.fetchComments.bind(this)}
          user={user}
          admin={admin}
        />)}
      </div>
    )
  }
}

module.exports = Comments