var React = require('react')

class ManageArticle extends React.Component {
  render() {
    var { article } = this.props
    return (
      <div className="six columns article">
        <input ref="title" defaultValue={article.title} />
        <textarea ref="textarea" defaultValue={article.text} />
        <div>
          <button>Uppdatera</button>
          <button style={{float: 'right', marginRight: 0}}>Ta Bort</button>
        </div>
      </div>
    )
  }
}

module.exports = ManageArticle