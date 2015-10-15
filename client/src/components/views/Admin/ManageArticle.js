const React = require('react')
const ArticleStore = require('../../../stores/ArticleStore')

class ManageArticle extends React.Component {
  componentWillMount() {
    this.id = this.props.article._id
  }

  save() {
    const opts = {
      title: this.refs.title.value,
      content: this.refs.content.value
    }

    if (this.id) {
      return ArticleStore.update(this.id, opts)
    }

    ArticleStore.create(opts, article => {
      this.props.history.pushState(null, `/admin/articles/${article._id}`)
    })
  }

  delete() {
    ArticleStore.delete(this.id)
    this.props.history.pushState(null, '/admin/articles')
  }

  render() {
    const { article } = this.props
    return (
      <div>
        <input ref="title" placeholder="Rubrik" defaultValue={article.title} />
        <textarea ref="content" defaultValue={article.content} />
        <div style={{float: 'right'}}>
          <button onClick={this.save.bind(this)}>Spara</button>
          {this.id && <button style={{marginLeft: 10}} onClick={this.delete.bind(this)}>Ta Bort</button>}
        </div>
      </div>
    )
  }
}

module.exports = ManageArticle