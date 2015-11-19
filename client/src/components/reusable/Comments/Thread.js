const React = require('react')
const CommentStore = require('../../../stores/CommentStore')
const Comment = require('./Comment')

class Thread extends React.Component {
  componentWillMount() {
    const { replies, comment } = this.props
    this.state = {
      comment,
      replies,
      showReply: false
    }
  }

  fetchReplies(limit) {
    const { comment } = this.props
    CommentStore.fetchReplies(comment._id, limit)
      .then(({ comment, replies }) => this.setState({ comment, replies }))
      .catch(err => {
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
    return replies.map(reply => <Comment
      key={reply._id}
      comment={reply}
      onDelete={this.fetchReplies.bind(this, replies.length)}
      user={user}
      admin={admin}
    />)
  }

  toggleReply() {
    this.setState({showReply: !this.state.showReply})
  }

  render() {
    const { showReply, replies, comment } = this.state
    const { user, admin, onDelete } = this.props
    return (
      <div className="Thread">
        <Comment
          key={comment._id}
          comment={comment}
          onDelete={onDelete}
          user={user}
          admin={admin}
        />
        <div className="options">
          <span onClick={this.toggleReply.bind(this)} className="option">Svara</span>
          {replies && comment.numReplies > replies.length && (
            <span onClick={this.fetchReplies.bind(this)} className="option">
              {`Visa alla ${comment.numReplies} svar`}
            </span>
          )}
        </div>
        {showReply && <form className="reply" onSubmit={this.reply.bind(this)}>
          <input ref="reply" className="replyInput" placeholder="Svara" />
        </form>}
        {replies && <div className="replies">{this.renderReplies()}</div>}
      </div>
    )
  }
}

module.exports = Thread