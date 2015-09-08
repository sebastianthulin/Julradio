var React = require('react')
var { Link } = require('react-router')
var Modal = require('../../services/Modal')

class Header extends React.Component {
  render() {
    return (
      <div id="header">
        <Link to="/" className="logo">
          <span className="julradio">Julradio</span>
          <span className="slogan">Nätets Bästa Julmusik</span>
        </Link>
        <Link to="/admin/articles">Admin page</Link>
        <div className="user">
          <button onClick={Modal.open.bind(null, 'LogIn')}>Logga in</button>
          <button onClick={Modal.open.bind(null, 'SignUp')}>Registrera dig</button>
        </div>
      </div>
    )
  }
}

module.exports = Header