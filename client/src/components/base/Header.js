var React = require('react')
var { Link } = require('react-router')
var Modal = require('../../services/Modal')
var UserStore = require('../../stores/UserStore')

class MenuItem extends React.Component {
  render() {
    var { text, to, onClick } = this.props
    var btn = <button onClick={onClick}>{text}</button>
    return to ? <Link to={to}>{btn}</Link> : btn
  }
}

class Header extends React.Component {
  componentWillMount() {
    UserStore.subscribe(user => this.setState({user}))
  }

  render() {
    var { user } = this.state

    var menuItems = [{
      if: user,
      text: user && user.username,
      to: user && '/user/' + user.username
    }, {
      if: user,
      text: 'Admin',
      to: '/admin/articles'
    }, {
      if: user,
      text: 'Logga ut',
      onClick: UserStore.logOut
    }, {
      if: !user,
      text: 'Logga in',
      onClick: Modal.open.bind(null, 'LogIn')
    }, {
      if: !user,
      text: 'Registrera dig',
      onClick: Modal.open.bind(null, 'SignUp')
    }].filter(item => item.if).map(item => <MenuItem key={item.text} {...item} />)

    return (
      <div id="header">
        <Link to="/" className="julradio">Julradio</Link>
        <div className="user">
          {menuItems}
        </div>
      </div>
    )
  }
}

module.exports = Header