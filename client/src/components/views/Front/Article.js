const React = require('react')
const { Link } = require('react-router')
const TimeSince = require('../../reusable/TimeSince')
const ProfilePicture = require('../../reusable/ProfilePicture')

const Article = ({ article, article: { user } }) => (
  <div className="article">
    <h2>{article.title}</h2>
    <div className="header">
      {user.picture && <ProfilePicture {...user.picture} />}
      <Link to={`/@${user.username}`} className="user">{user.username}</Link>
      <br />
      <TimeSince className="timestamp" date={article.date} />
    </div>
    <div className="markdown-body" dangerouslySetInnerHTML={{__html: article.marked}} />
  </div>
)

module.exports = Article