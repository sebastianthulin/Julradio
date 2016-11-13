const React = require('react')
const Comment = require('./Comment')

class Thread extends React.Component {
  fetchReplies() {
    this.props.onFetchReplies(this.props.target, this.props.comment.get('_id'))
  }

  reply(evt) {
    const {replies, comment} = this.props
    const text = this.refs.reply.value.trim()
    evt.preventDefault()
    if (text) {
      this.props.onPostReply(comment.get('_id'), text).then(() => {
        this.refs.reply.value = ''
        this.toggleReply()
        this.fetchReplies()
      })
    }
  }

  toggleReply() {
    this.setState({showReply: !this.state || !this.state.showReply})
  }

  render() {
    const {replies, comment, user, admin, onDelete} = this.props
    const {showReply} = this.state || {}
    return (
      <div className="Thread">
        <Comment
          key={comment.get('_id')}
          comment={comment}
          onDelete={onDelete}
          user={user}
          admin={admin}
        />
        <div className="options">
          <span onClick={this.toggleReply.bind(this)} className="option">Svara</span>
          {replies && comment.get('numReplies') > replies.size && (
            <span onClick={this.fetchReplies.bind(this)} className="option">
              {`Visa alla ${comment.get('numReplies')} svar`}
            </span>
          )}
        </div>
        {showReply && (
          <form className="reply" onSubmit={this.reply.bind(this)}>
            <input ref="reply" className="replyInput" placeholder="Svara" />
          </form>
        )}
        {replies && (
          <div className="replies">
            {replies.map(reply => <Comment
              key={reply.get('_id')}
              comment={reply}
              onDelete={replyId => onDelete(replyId, comment.get('_id'))}
              user={user}
              admin={admin}
            />)}
          </div>
        )}
      </div>
    )
  }
}

module.exports = Thread
