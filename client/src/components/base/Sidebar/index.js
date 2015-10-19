const React = require('react')
const { Link } = require('react-router')
const Modal = require('../../../services/Modal')
const User = require('../../../services/User')
const RadioStore = require('../../../stores/RadioStore')
const Player = require('./Player')
const Snowfall = require('../Snowfall')
const ProfilePicture = require('../../reusable/ProfilePicture')
const Fire = require('../../../svg/Fire')
const Messenger = require('../../../svg/Messenger')

const divider = <div className="divider" />

class Sidebar extends React.Component {
  componentWillMount() {
    User.subscribe(user => this.setState({ user }))
    RadioStore.subscribe('onair', onair => this.setState({ onair }))
  }

  renderUser() {
    const { user } = this.state
    return user ? (
      <Link to={`/@${user.username}`} className="user">
        <ProfilePicture {...user.picture} />
        {user.username}
      </Link>
    ) : (
      <div>
        <div onClick={Modal.open.bind(null, 'LogIn')}>
          <i className="fa fa-heart" />
          Logga in
        </div>
        <div onClick={Modal.open.bind(null, 'SignUp')}>
          <i className="fa fa-heart-o" />
          Registrera
        </div>
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
        <div className="main">
          <div className="logo">
            <Link to="/">Julradio</Link>
            <hr />
          </div>
          {this.renderUser()}
          {divider}
          <Link to="/messages">
            <button>
              <Messenger />
              Meddelanden
            </button>
          </Link>
          <button>
            <Fire />
            Träffa
          </button>
          {divider}
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