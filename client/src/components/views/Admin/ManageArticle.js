const React = require('react')
const { Link } = require('react-router')
const marked = require('marked')
const User = require('../../../services/User')
const ArticleStore = require('../../../stores/ArticleStore')
const Article = require('../../reusable/Article')

class ManageArticle extends React.Component {
  componentWillMount() {
    this.id = this.props.article._id
    const copy = Object.assign({}, this.props.article)
    if (!copy._id) {
      copy.content = ''
      copy.user = User.get()
    }
    copy.__html = marked(copy.content)
    this.state = { copy }
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
    if (confirm('Säkert?')) {
      ArticleStore.delete(this.id)
      this.props.history.pushState(null, '/admin/articles')
    }
  }

  update() {
    const copy = Object.assign({}, this.state.copy)
    copy.title = this.refs.title.value
    copy.content = this.refs.content.value
    copy.__html = marked(copy.content)
    this.setState({ copy })
  }

  render() {
    const { copy } = this.state
    const { article } = this.props
    return (
      <div id="ManageArticle">
        <Link className="goback" to={'/admin/articles'}>Gå tillbaka</Link>
        <div className="row">
          <div className="oneHalf column">
            <label className="setting">
              <div className="label">Titel</div>
              <input
                type="text"
                ref="title"
                value={copy.title}
                onChange={this.update.bind(this)}
              />
            </label>
            <textarea
              ref="content"
              value={copy.content}
              onChange={this.update.bind(this)}
            />
            <div style={{margin: '10px 0'}}>
              <button className="btn" onClick={this.save.bind(this)}>Spara</button>
              {this.id && <button className="btn" style={{marginLeft: 10}} onClick={this.delete.bind(this)}>Ta Bort</button>}
            </div>
            <div>
              Här kan <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">markdown</a> användas.
            </div>
          </div>
          <div className="oneHalf column">
            <Article article={copy} />
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ManageArticle