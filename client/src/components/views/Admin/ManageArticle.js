const React = require('react')
const { Link } = require('react-router')
const marked = require('marked')
const User = require('../../../services/User')
const ArticleStore = require('../../../stores/ArticleStore')
const Article = require('../../reusable/Article')

class ManageArticle extends React.Component {
  componentWillMount() {
    const { article } = this.props
    const copy = {}
    this.id = article._id

    for (var i in article) {
      copy[i] = article[i]
    }
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
    const copy = {}
    for (var i in this.state.copy) {
      copy[i] = this.state.copy[i]
    }
    copy.title = this.refs.title.value
    copy.content = this.refs.content.value
    copy.__html = marked(copy.content)
    this.setState({ copy })
  }

  cancel() {
    this.props.history.pushState(null, '/admin/articles')
  }

  render() {
    const { copy } = this.state
    const { article } = this.props
    return (
      <div id="ManageArticle">
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
              <button
                className="btn"
                onClick={this.save.bind(this)}
                children="Spara"
              />
              {this.id && <button
                className="btn"
                style={{marginLeft: 10}}
                onClick={this.delete.bind(this)}
                children="Ta Bort"
              />}
              <button
                className="btn"
                style={{marginLeft: 10}}
                onClick={this.cancel.bind(this)}
                children="Avbryt"
              />
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