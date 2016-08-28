const React = require('react')
const {Link} = require('react-router')
const marked = require('marked')
const User = require('../../../services/User')
const Article = require('../../reusable/Article')

class ManageArticle extends React.Component {
  getOpts() {
    return {
      title: this.refs.title.value,
      content: this.refs.content.value,
      userless: this.refs.userless && this.refs.userless.checked
    }
  }

  save() {
    if (this.props.editing.get('_id')) {
      this.props.updateArticle()
    } else {
      this.props.createArticle()
    }
  }

  delete() {
    if (confirm('Säkert?')) {
      this.props.deleteArticle()
    }
  }

  update() {
    this.props.updateArticleLocally(this.getOpts())
  }

  cancel() {
    this.props.cancelEdit()
    this.props.history.push('/admin/articles')
  }

  render() {
    const {editing: article} = this.props
    const underConstruction = !article.get('_id')
    return (
      <div id="ManageArticle">
        <div className="row">
          <div className="oneHalf column">
            <label className="setting">
              <div className="label">Titel</div>
              <input
                type="text"
                ref="title"
                value={article.get('title')}
                onChange={this.update.bind(this)}
              />
            </label>
            {underConstruction && (
              <div>
                <span>Posta som Julradio</span>
                <input
                  type="checkbox"
                  ref="userless"
                  onChange={this.update.bind(this)}
                />
              </div>
            )}
            <textarea
              ref="content"
              value={article.get('content')}
              onChange={this.update.bind(this)}
            />
            <div style={{margin: '10px 0'}}>
              <button
                className="btn"
                onClick={this.save.bind(this)}
                children="Spara"
              />
              {!underConstruction && <button
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
            <Article article={article} />
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ManageArticle
