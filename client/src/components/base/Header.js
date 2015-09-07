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
        <Link to="/admin">Admin page</Link>
      </div>
    )
  }
}

module.exports = Header