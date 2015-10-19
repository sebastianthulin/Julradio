const React = require('react')
const { Link } = require('react-router')
const cx = require('classnames')
const Modal = require('../../../services/Modal')
const User = require('../../../services/User')
const RadioStore = require('../../../stores/RadioStore')
const Player = require('./Player')
const Snowfall = require('../Snowfall')
const ProfilePicture = require('../../reusable/ProfilePicture')
const Fire = require('../../svg/Fire')
const Messenger = require('../../svg/Messenger')

const divider = <div className="divider" />

class Sidebar extends React.Component {
  componentWillMount() {
    User.subscribe(user => this.setState({ user }))
    RadioStore.subscribe('onair', onair => this.setState({ onair }))
  }

  renderUser() {
    const { user } = this.state
    return user ? (
      <div>
        <Link to={`/@${user.username}`} className="user">
          <ProfilePicture {...user.picture} />
          {user.username}
        </Link>
      </div>
    ) : (
      <div className="login-area">
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
    const { user, onair } = this.state
    return (
      <div id="sidebar">
        <Snowfall
          active={onair}
          count={500}
          minSize={1}
          maxSize={2}
          minSpeed={0.5}
          maxSpeed={2}
        />
        <div className={cx('main', {abandoned: !user})}>
          <div className="logo">
            <Link to="/">Julradio</Link>
            <hr />
          </div>
          {this.renderUser()}
          {user && divider}
          {user && <Link to="/messages">
            <button className="user-action">
              <Messenger />
              Meddelanden
            </button>
          </Link>}
          {user && <button className="user-action">
            <Fire />
            Träffa
          </button>}
          {user && divider}
          <div className="shortcuts">
            {user && user.admin && <Link to="/admin/articles">Admin</Link>}
            {user && <Link to="/settings">Inställningar</Link>}
            <a href="https://webchat.quakenet.org/?channels=julradio&nick=" target="_new">IRC</a>
            <Link to="/crew">Medarbetare</Link>
            {user && <a onClick={User.logOut}>Logga ut</a>}
          </div>
        </div>
        <Player />
      </div>
    )
  }
}

module.exports = Sidebar