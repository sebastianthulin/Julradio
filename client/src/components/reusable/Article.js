const React = require('react')
const { Link } = require('react-router')
const TimeSince = require('./TimeSince')
const ProfilePicture = require('./ProfilePicture')

const Article = ({ article, article: { user } }) => (
  <div className="Article">
    <h2>{article.title}</h2>
    <header>
      <ProfilePicture {...user.picture} />
      <div className="user">
        <Link to={`/@${user.username}`}>{user.name}</Link>
        <Link to={`/article/${article._id}`}><TimeSince date={article.date} /></Link>
      </div>
    </header>
    <div className="markdownBody" dangerouslySetInnerHTML={article} />
  </div>
)

module.exports = Article