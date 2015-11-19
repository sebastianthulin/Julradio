const React = require('react')
const User = require('../../../services/User')
const history = require('../../../services/history')
const CommentStore = require('../../../stores/CommentStore')
const Thread = require('./Thread')

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