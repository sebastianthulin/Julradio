const React = require('react')
const {connect} = require('react-redux')
const {Link} = require('react-router')
const cx = require('classnames')
const Player = require('./Player')
const Snowfall = require('../Snowfall')
const SVG = require('../../svg')
const ProfilePicture = require('../../reusable/ProfilePicture')
const {openModal} = require('../../../actions/modal')
const {togglePlay, setVolume, toggleMute} = require('../../../actions/player')
const {logOut} = require('../../../actions/account')
const selectors = require('../../../selectors')

const divider = <div className="divider" />

@connect(state => ({
  user: state.account,
  isPrivileged: selectors.isPrivileged(state),
  volume: state.player.get('volume'),
  playing: state.player.get('playing'),
  connected: state.player.get('connected'),
  nowPlaying: state.player.get('nowPlaying'),
  onAir: state.reservations.get('onAir'),
  unseenMessages: state.notifications.getIn(['unseenCount', 'message']).size,
  unseenWallPosts: state.notifications.getIn(['unseenCount', 'wallPost']).size
}), {
  openModal,
  onTogglePlay: togglePlay,
  onSetVolume: setVolume,
  onToggleMute: toggleMute,
  onLogOut: logOut
})
class Sidebar extends React.Component {
  renderUser() {
    const {user, openModal, unseenWallPosts} = this.props
    return user ? (
      <Link to={`/@${user.username}`} className="user">
        {unseenWallPosts > 0 && (
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
        <div className="option" onClick={() => openModal('LogIn')} style={{marginBottom: 10}}>
          <span>Logga in</span>
          <SVG.Favorite />
        </div>
        <div className="option" onClick={() => openModal('SignUp')}>
          <span>Registrera</span>
          <SVG.FavoriteOutlined />
        </div>
      </div>
    )
  }

  render() {
    const {props} = this
    const {user} = props
    const playerLess = window.__PLAYERLESS__

    return (
      <div id="Sidebar" className={cx({playerLess})}>
        <Snowfall
          active={props.connected}
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
            {props.unseenMessages > 0 && <div className="notification">{props.unseenMessages}</div>}
            <span>Meddelanden</span>
          </Link>}
          <Link to="/cosycorner" className="userAction">
            <SVG.Fire />
            <span>Myshörnan</span>
          </Link>
          <Link to="/findusers" className="userAction"><span>Hitta användare</span></Link>
          {divider}
          <div className="shortcuts">
            <a href={'https://webchat.quakenet.org/?channels=julradio' + (user ? '&nick=' + user.username : '')} target="_new">IRC</a>
            {props.isPrivileged && <Link to="/admin/articles">Admin</Link>}
            {user && <Link to="/settings">Inställningar</Link>}
            <Link to="/crew">Medarbetare</Link>
            {user && <a onClick={props.onLogOut}>Logga ut</a>}
          </div>
          {!playerLess && (
            <Player
              volume={props.volume}
              playing={props.playing}
              nowPlaying={props.nowPlaying}
              onAir={props.onAir}
              onTogglePlay={props.onTogglePlay}
              onSetVolume={props.onSetVolume}
              onToggleMute={props.onToggleMute}
            />
          )}
        </div>
      </div>
    )
  }
}

module.exports = Sidebar
