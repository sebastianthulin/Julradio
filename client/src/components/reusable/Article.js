const React = require('react')
const {Link} = require('react-router')
const TimeSince = require('./TimeSince')
const ProfilePicture = require('./ProfilePicture')
const {handleLink} = require('../../utils')

const Article = ({article}) => {
  const user = article.get('user')
  return (
    <div className="Article">
      <h2>{article.get('title')}</h2>
      <header>
        <ProfilePicture id={user && user.get('picture')} />
        <div className="user">
          {user && <Link to={`/@${user.get('username')}`}>{user.get('name')}</Link>}
          {!user && <span>Julradio</span>}
          <TimeSince date={article.get('date')} />
        </div>
      </header>
      <div
        className="markdownBody"
        dangerouslySetInnerHTML={{__html: article.get('marked')}}
        onClick={handleLink}
      />
    </div>
  )
}

module.exports = Article
