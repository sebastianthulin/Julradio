const React = require('react')
const { Link } = require('react-router')
const Modal = require('../../services/Modal')
const UserStore = require('../../stores/UserStore')

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
    UserStore.subscribe(user => this.setState({ user }))
  }

  render() {
    const { user } = this.state
    return (
      <div id="header">
        <Link to="/" className="julradio">Julradio</Link>
        <div className="slogan">Nätets bästa julmusik</div>
        <div className="user">
          <a href="https://webchat.quakenet.org/?channels=julradio&nick=" target="_new">
            <button>
              <i className="fa fa-comment" />
            </button>
          </a>
          <MenuItem if={user} to="/messages/">
            Meddelanden
          </MenuItem>
          <MenuItem if={user} to={user && `/@${user.username}`}>
            {user && user.username}
          </MenuItem>
          <MenuItem if={user} to="/settings">
            Inställningar
          </MenuItem>
          <MenuItem if={user && user.admin} to="/admin/articles">
            Admin
          </MenuItem>
          <MenuItem if={user} onClick={UserStore.logOut}>
            Logga ut
          </MenuItem>
          <MenuItem if={!user} onClick={Modal.open.bind(null, 'LogIn')}>
            Logga in
          </MenuItem>
          <MenuItem if={!user} onClick={Modal.open.bind(null, 'SignUp')}>
            Registrera dig
          </MenuItem>
        </div>
      </div>
    )
  }
}

module.exports = Header