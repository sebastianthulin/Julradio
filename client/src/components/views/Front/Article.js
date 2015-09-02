var React = require('react')

class Article extends React.Component {
  render() {
    var { article } = this.props
    return (
      <div className="article">
        <h2>{article.title}</h2>
        <div dangerouslySetInnerHTML={{__html: article.html}} />
      </div>
    )
  }
}

module.exports = Article