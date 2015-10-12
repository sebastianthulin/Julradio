const React = require('react')
const { Link } = require('react-router')
const TimeSince = require('../../reusable/TimeSince')

const Article = ({ article, article: { user } }) => (
  <div className="article">
    <div className="header">
      {user.picture && <img src={'/i/' + user.picture._id + user.picture.extension} />}
      <Link to={`/@${user.username}`} className="user">{user.username}</Link>
      <TimeSince className="timestamp" date={article.date} />
    </div>
    <h2>{article.title}</h2>
    <div dangerouslySetInnerHTML={{__html: article.marked}} />
  </div>
)

module.exports = Article