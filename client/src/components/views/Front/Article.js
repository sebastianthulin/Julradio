const React = require('react')

class Article extends React.Component {
  render() {
    const { article } = this.props
    const { user } = article
    return (
      <div className="article">
        <div className="header">
          <img src={'/images/berkleyill.jpg'} />
          <span className="user">{user.username}</span>
          <span className="timestamp">5 timmar sedan</span>
        </div>
        <h2>{article.title}</h2>
        <div dangerouslySetInnerHTML={{__html: article.content}} />
      </div>
    )
  }
}

module.exports = Article