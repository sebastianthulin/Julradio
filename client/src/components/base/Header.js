const React = require('react')
const { Link } = require('react-router')
const Modal = require('../../services/Modal')
const User = require('../../services/User')

const MenuItem = ({ children, to, onClick, if: visible }) => {
  const btn = <button onClick={onClick}>{children}</button>
  if (typeof visible === 'undefined' || visible) {
    return to ? <Link to={to}>{btn}</Link> : btn
  } else {
    return <noscript />
  }
}

class Header extends React.Component {
  componentWillMount() {
    User.subscribe(user => this.setState({ user }))
  }

  render() {
    const { user } = this.state
    return (
      <div id="header">
        <Link to="/" className="julradio">Julradio</Link>
        <div className="slogan">Nätets bästa julmusik</div>
        <div className="menu">
          <MenuItem if={user && user.admin} to="/admin/articles">
            <i className="fa fa-shield" />
            Admin
          </MenuItem>
          <MenuItem to="/crew">
            <i className="fa check-circle" />
            Medarbetare
          </MenuItem>
          <a href="https://webchat.quakenet.org/?channels=julradio&nick=" target="_new">
            <button>
              <i className="fa fa-certificate" />
              IRC
            </button>
          </a>
          <MenuItem if={user} to="/messages/">
            <i className="fa fa-comments" />
            Meddelanden
          </MenuItem>
          <MenuItem if={user} to={user && `/@${user.username}`}>
            <i className="fa fa-user" />
            {user && user.username}
          </MenuItem>
          <div className="menu-divider" />
          <MenuItem if={user} to="/settings">
            <i className="fa fa-cog big" />
          </MenuItem>
          <MenuItem if={user} onClick={User.logOut}>
            <i className="fa fa-sign-out big" />
          </MenuItem>
          <MenuItem if={!user} onClick={Modal.open.bind(null, 'LogIn')}>
            <i className="fa fa-heart" />
            Logga in
          </MenuItem>
          <MenuItem if={!user} onClick={Modal.open.bind(null, 'SignUp')}>
            <i className="fa fa-heart-o" />
            Registrera
          </MenuItem>
        </div>
      </div>
    )
  }
}

module.exports = Header