var React = require('react')
var NewsStore = require('../../../stores/NewsStore')

class ManageArticle extends React.Component {
  componentWillMount() {
    this.id = this.props.article.id
  }

  save() {
    var opts = {
      title: this.refs.title.getDOMNode().value,
      content: this.refs.content.getDOMNode().value
    }

    if (this.id) {
      return NewsStore.update(this.id, opts)
    }

    NewsStore.create(opts, article => {
      this.id = article.id
      this.context.router.transitionTo('/admin/articles/' + article.id)
    })
  }

  delete() {
    NewsStore.delete(this.id)
    this.context.router.transitionTo('/admin/articles')
  }

  render() {
    var { article } = this.props
    return (
      <div>
        <input ref="title" defaultValue={article.title} />
        <textarea ref="content" defaultValue={article.content} />
        <div style={{float: 'right'}}>
          <button onClick={this.save.bind(this)}>Spara</button>
          {this.id && <button style={{marginLeft: 10}} onClick={this.delete.bind(this)}>Ta Bort</button>}
        </div>
      </div>
    )
  }
}

ManageArticle.contextTypes = {
  router: React.PropTypes.func
}

module.exports = ManageArticle