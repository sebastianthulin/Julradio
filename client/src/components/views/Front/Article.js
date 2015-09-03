var React = require('react')

class Article extends React.Component {
  render() {
    var { article } = this.props
    return (
      <div className="article">
        <div className="header">
          <img src={article.userpic} />
          <span className="user">{article.username}</span>
          <span className="timestamp">5 timmar sedan</span>
        </div>
        <h2>{article.title}</h2>
        <div dangerouslySetInnerHTML={{__html: article.html}} />
      </div>
    )
  }
}

module.exports = Article