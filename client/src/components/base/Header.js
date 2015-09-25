var React = require('react')
var { Link } = require('react-router')
var Modal = require('../../services/Modal')
var UserStore = require('../../stores/UserStore')

class MenuItem extends React.Component {
  render() {
    var { to, onClick, children } = this.props
    var btn = <button onClick={onClick}>{children}</button>
    return this.props.if ?
      to
        ? <Link to={to}>{btn}</Link>
        : btn
      : null
  }
}

class Header extends React.Component {
  componentWillMount() {
    UserStore.subscribe(user => this.setState({user}))
  }

  render() {
    var { user } = this.state
    return (
      <div id="header">
        <Link to="/" className="logo">
          <span className="julradio">Julradio</span>
          <span className="slogan">Nätets Bästa Julmusik</span>
        </Link>
        <div className="user">
          <MenuItem if={user} to="/admin/articles">Admin</MenuItem>
          <MenuItem if={user} onClick={UserStore.logOut}>Logga ut</MenuItem>
          <MenuItem if={!user} onClick={Modal.open.bind(null, 'LogIn')}>Logga in</MenuItem>
          <MenuItem if={!user} onClick={Modal.open.bind(null, 'SignUp')}>Registrera dig</MenuItem>
        </div>
      </div>
    )
  }
}

module.exports = Header