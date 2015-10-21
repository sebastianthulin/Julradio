const React = require('react')
const { Link } = require('react-router')

const Navigation = () => (
  <div className="navigation">
    <Link to="/admin/articles" activeClassName="active">Nyheter</Link>
    <a>Tävlingar</a>
    <Link to="/admin/users" activeClassName="active">Konton</Link>
    <Link to="/admin/schedule" activeClassName="active">Tablå</Link>
    <Link to="/admin/crew" activeClassName="active">Medarbetare</Link>
    <Link to="/admin/requests" activeClassName="active">Önskningar</Link>
  </div>
)

module.exports = Navigation