const React = require('react')
const { Link } = require('react-router')
const TimeSince = require('./TimeSince')
const ProfilePicture = require('./ProfilePicture')

const Article = ({ article, article: { user, userless } }) => (
  <div className="Article">
    <h2>{article.title}</h2>
    <header>
      <ProfilePicture id={userless ? null : user.picture} />
      <div className="user">
        {!userless && <Link to={`/@${user.username}`}>{user.name}</Link>}
        {userless && <span>Julradio</span>}
        <TimeSince date={article.date} />
      </div>
    </header>
    <div className="markdownBody" dangerouslySetInnerHTML={article} />
  </div>
)

module.exports = Article