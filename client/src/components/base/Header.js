const React = require('react')
const { Link } = require('react-router')
const Modal = require('../../services/Modal')
const UserStore = require('../../stores/UserStore')

class MenuItem extends React.Component {
  render() {
    const { text, to, onClick } = this.props
    const btn = <button onClick={onClick}>{text}</button>
    return to ? <Link to={to}>{btn}</Link> : btn
  }
}

class Header extends React.Component {
  componentWillMount() {
    UserStore.subscribe(user => this.setState({user}))
  }

  render() {
    const { user } = this.state
    const menuItems = [{
      if: true,
      text: 'Meddelanden',
      to: '/messages/asdf'
    }, {
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