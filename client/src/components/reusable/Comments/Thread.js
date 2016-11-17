const React = require('react')
const Comment = require('./Comment')

class Thread extends React.Component {
  fetchReplies() {
    this.props.onFetchReplies(this.props.target, this.props.comment.get('_id'))
  }

  reply(evt) {
    const {replies, comment, target} = this.props
    const text = this.refs.reply.value.trim()
    evt.preventDefault()
    if (text) {
      this.props.onPostReply(comment.get('_id'), text, target).then(() => {
        this.refs.reply.value = ''
        this.setState({showReply: false})
        this.fetchReplies()
      })
    }
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
          <span className="option" onClick={() => this.setState({showReply: !showReply})}>
            Svara
          </span>
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
