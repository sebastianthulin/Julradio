var React = require('react')
var { Link } = require('react-router')

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
          <Link to="/signup">Logga in</Link>
          <Link to="/signup">Registrera dig</Link>
        </div>
      </div>
    )
  }
}

module.exports = Header