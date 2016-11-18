const React = require('react')
const {connect} = require('react-redux')
const {fetchComments, fetchReplies, postComment, postReply, deleteComment} = require('../../../actions/comments')
const selectors = require('../../../selectors')
const Thread = require('./Thread')

@connect((state, props) => ({
  user: state.account,
  isAdmin: selectors.isAdmin(state),
  comments: selectors.comments(state, props.target),
  commentCount: selectors.commentCount(state, props.target),
  threadCount: selectors.threadCount(state, props.target)
}), {
  onFetchComments: fetchComments,
  onFetchReplies: fetchReplies,
  onPostComment: postComment,
  onPostReply: postReply,
  onDeleteComment: deleteComment
})
class Comments extends React.Component {
  componentWillMount() {
    this.fetchComments(true)
    this.handleScroll = this.handleScroll.bind(this)
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    if (this.props.comments && this.props.comments.size < this.props.threadCount) {
      const body = document.body
      const html = document.documentElement
      const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const distanceToBottom = pageYOffset - (height - window.innerHeight)
      if (distanceToBottom >= -30) {
        this.fetchComments()
      }
    }
  }

  fetchComments(fromTop) {
    this.props.onFetchComments(this.props.type, this.props.target, fromTop)
  }

  post(evt) {
    const {type, target, onPostComment} = this.props
    const text = this.refs.input.value.trim()
    evt.preventDefault()
    if (text) {
      onPostComment(type, target, text).then(err => {
        if (!err) {
          this.refs.input.value = ''
        }
      })
    }
  }

  renderForm() {
    const {user} = this.props
    const {block, placeholder, signInPlaceholder} = this.props
    const p = user ?
      placeholder || 'Skriv en kommentar' :
      signInPlaceholder || 'Logga in för att kommentera'

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

  render() {
    const {props} = this
    if (!props.comments) return null
    return (
      <div className="Comments">
        {this.renderForm()}
        {props.comments.map(com => <Thread
          key={com.getIn(['comment', '_id'])}
          comment={com.get('comment')}
          replies={com.get('replies')}
          user={props.user}
          admin={props.isAdmin}
          target={props.target}
          onDelete={(commentId, replyTo) => props.onDeleteComment(props.target, commentId, replyTo)}
          onFetchReplies={props.onFetchReplies}
          onPostReply={props.onPostReply}
        />)}
        {props.comments.size < props.threadCount && (
          <button className="btn" onClick={() => this.fetchComments()}>
            Visa äldre meddelanden
          </button>
        )}
      </div>
    )
  }
}

module.exports = Comments
