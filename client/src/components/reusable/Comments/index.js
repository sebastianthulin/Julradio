const React = require('react')
const User = require('../../../services/User')
const history = require('../../../services/history')
const CommentStore = require('../../../stores/CommentStore')
const NotificationStore = require('../../../stores/NotificationStore')
const Thread = require('./Thread')

class Comments extends React.Component {
  componentWillMount() {
    this.offset = 0
    this.user = User.get()
    this.admin = User.isAdmin()
    this.fetchComments()
  }

  fetchComments() {
    const offset = this.offset
    const { type, target } = this.props
    CommentStore.fetch({ type, target, offset }, comments => this.setState({ comments }))
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
      NotificationStore.error({
        type: 'comment',
        value: err.response.body.error[0]
      })
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

  loadMore() {
    ++this.offset
    this.fetchComments()
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
        <button onClick={this.loadMore.bind(this)}>Visa äldre kommentarer</button>
      </div>
    )
  }
}

module.exports = Comments