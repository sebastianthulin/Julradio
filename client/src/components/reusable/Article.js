const React = require('react')
const { Link } = require('react-router')
const TimeSince = require('./TimeSince')
const ProfilePicture = require('./ProfilePicture')

const Article = ({ article, article: { user } }) => (
  <div className="Article">
    <h2>{article.title}</h2>
    <header>
      {user.picture && <ProfilePicture {...user.picture} />}
      <div className="user">
        <Link to={`/@${user.username}`}>{user.username}</Link>
        <TimeSince date={article.date} />
      </div>
    </header>
    <div className="markdownBody" dangerouslySetInnerHTML={article} />
  </div>
)

module.exports = Article