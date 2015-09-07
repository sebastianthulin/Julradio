var React = require('react')

class Article extends React.Component {
  render() {
    var { article } = this.props
    return (
      <div className="article">
        <div className="header">
          <img src={'/images/berkleyill.jpg'} />
          <span className="user">{article.user}</span>
          <span className="timestamp">5 timmar sedan</span>
        </div>
        <h2>{article.title}</h2>
        <div dangerouslySetInnerHTML={{__html: article.text}} />
      </div>
    )
  }
}

module.exports = Article