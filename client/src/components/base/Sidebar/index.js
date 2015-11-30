const React = require('react')
const { Link } = require('react-router')
const cx = require('classnames')
const Modal = require('../../../services/Modal')
const User = require('../../../services/User')
const RadioStore = require('../../../stores/RadioStore')
const ShitStore = require('../../../stores/ShitStore')
const UIStore = require('../../../stores/UIStore')
const ProfilePicture = require('../../reusable/ProfilePicture')
const SVG = require('../../svg')
const Snowfall = require('../Snowfall')
const Player = require('./Player')

const divider = <div className="divider" />

class Sidebar extends React.Component {
  componentWillMount() {
    User.subscribe(user => this.setState({ user }))
    RadioStore.subscribe('onair', onair => this.setState({ onair }))
    ShitStore.subscribe('message', unseenMessages => this.setState({ unseenMessages }))
    ShitStore.subscribe('wallPost', unseenWallPosts => this.setState({ unseenWallPosts }))
  }

  handleClick(ev) {
    if (ev.target.tagName === 'A' && ev.metaKey === false) {
      UIStore.close('SIDEBAR_OPEN')
    }
  }

  renderUser() {
    const { user, unseenWallPosts } = this.state
    return user ? (
      <Link to={`/@${user.username}`} className="user">
        {unseenWallPosts.length > 0 && (
          <div className="unseenCircle">
            <span>1+</span>
          </div>
        )}
        <ProfilePicture id={user.picture} />
        <div>{user.name ? user.name : '@' + user.username}</div>
        {user.name && <div className="handle">{'@' + user.username}</div>}
      </Link>
    ) : (
      <div className="loginArea">
        <div className="option" onClick={Modal.open.bind(null, 'LogIn')} style={{marginBottom: 10}}>
          <span>Logga in</span>
          <SVG.Favorite />
        </div>
        <div className="option" onClick={Modal.open.bind(null, 'SignUp')}>
          <span>Registrera</span>
          <SVG.FavoriteOutlined />
        </div>
      </div>
    )
  }

  render() {
    const {
      user,
      onair,
      unseenMessages
    } = this.state

    const playerLess = window.__PLAYERLESS__

    return (
      <div id="Sidebar" className={cx({ playerLess })} onClick={this.handleClick.bind(this)}>
        <Snowfall
          active={onair}
          count={500}
          minSize={1}
          maxSize={2}
          minSpeed={0.5}
          maxSpeed={2}
        />
        <div className={cx('inner', {abandoned: !user})}>
          <div className="logo">
            <Link to="/">Julradio</Link>
            <hr />
          </div>
          {this.renderUser()}
          {divider}
          {user && <Link to="/messages" className="userAction">
            <SVG.Messenger />
            {unseenMessages.length > 0 && <div className="notification">{unseenMessages.length}</div>}
            <span>Meddelanden</span>
          </Link>}
          <Link to="/cosycorner" className="userAction">
            <SVG.Fire />
            <span>Myshörnan</span>
          </Link>
          {divider}
          <div className="shortcuts">
            <a href="https://webchat.quakenet.org/?channels=julradio&nick=" target="_new">IRC</a>
            {User.isAnything() && <Link to="/admin/articles">Admin</Link>}
            {user && <Link to="/settings">Inställningar</Link>}
            <Link to="/crew">Medarbetare</Link>
            {user && <a onClick={User.logOut}>Logga ut</a>}
          </div>
          {!playerLess && <Player />}
        </div>
      </div>
    )
  }
}

module.exports = Sidebar