const React = require('react')
const { Link } = require('react-router')
const history = require('../../services/history')
const TimeSince = require('./TimeSince')
const ProfilePicture = require('./ProfilePicture')

class Article extends React.Component {
  handleClick(ev) {
    if (ev.target.tagName === 'A' && ev.metaKey === false) {
      if (ev.target.host === window.location.host) {
        ev.preventDefault()
        history.push(ev.target.pathname)
      }
    }
  }

  render() {
    const { article, article: { user, userless } } = this.props
    return (
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
        <div
          className="markdownBody"
          dangerouslySetInnerHTML={article}
          onClick={this.handleClick.bind(this)}
        />
      </div>
    )
  }
}

module.exports = Article