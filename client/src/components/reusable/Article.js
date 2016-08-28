const React = require('react')
const {Link, browserHistory} = require('react-router')
const TimeSince = require('./TimeSince')
const ProfilePicture = require('./ProfilePicture')

class Article extends React.Component {
  handleClick(ev) {
    if (ev.target.tagName === 'A' && ev.metaKey === false) {
      if (ev.target.host === window.location.host) {
        ev.preventDefault()
        browserHistory.push(ev.target.pathname)
      }
    }
  }

  render() {
    const {article} = this.props
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
          onClick={this.handleClick.bind(this)}
        />
      </div>
    )
  }
}

module.exports = Article
