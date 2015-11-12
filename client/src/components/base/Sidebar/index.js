const React = require('react')
const { Link } = require('react-router')
const cx = require('classnames')
const Modal = require('../../../services/Modal')
const User = require('../../../services/User')
const RadioStore = require('../../../stores/RadioStore')
const ShitStore = require('../../../stores/ShitStore')
const Player = require('./Player')
const Snowfall = require('../Snowfall')
const ProfilePicture = require('../../reusable/ProfilePicture')
const SVG = require('../../svg')

const divider = <div className="divider" />

class Sidebar extends React.Component {
  componentWillMount() {
    User.subscribe(user => this.setState({ user }))
    RadioStore.subscribe('onair', onair => this.setState({ onair }))
    ShitStore.subscribe('message', unseenMessages => this.setState({ unseenMessages }))
  }

  renderUser() {
    const { user } = this.state
    return user ? (
      <div>
        <Link to={`/@${user.username}`} className="user">
          <ProfilePicture id={user.picture} />
          {user.username}
        </Link>
      </div>
    ) : (
      <div className="loginArea">
        <button onClick={Modal.open.bind(null, 'LogIn')} style={{marginBottom: 10}}>
          Logga in
          <i className="fa fa-heart" />
        </button>
        <button onClick={Modal.open.bind(null, 'SignUp')}>
          Registrera
          <i className="fa fa-heart-o" />
        </button>
      </div>
    )
  }

  render() {
    const { user, onair, unseenMessages } = this.state
    return (
      <div id="Sidebar">
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
          {user && divider}
          {user && <Link to="/messages">
            <button className="userAction">
              <SVG.Messenger />
              { unseenMessages.length > 0 && <div className="notification">{ unseenMessages.length.toString() }</div> }
              Meddelanden
            </button>
          </Link>}
          {user && <button className="userAction">
            <SVG.Fire />
            Träffa
          </button>}
          {user && divider}
          <div className="shortcuts">
            <a href="https://webchat.quakenet.org/?channels=julradio&nick=" target="_new">IRC</a>
            {User.isAnything() && <Link to="/admin/articles">Admin</Link>}
            {user && <Link to="/settings">Inställningar</Link>}
            <Link to="/crew">Medarbetare</Link>
            {user && <a onClick={User.logOut}>Logga ut</a>}
          </div>
          <Player />
        </div>
      </div>
    )
  }
}

module.exports = Sidebar