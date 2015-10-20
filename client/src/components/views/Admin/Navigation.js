const React = require('react')
const { Link } = require('react-router')

const Navigation = () => (
  <div className="navigation">
    <Link to="/admin/articles">Nyheter</Link>
    <a>Tävlingar</a>
    <Link to="/admin/users">Konton</Link>
    <Link to="/admin/schedule">Tablå</Link>
    <Link to="/admin/crew">Medarbetare</Link>
    <Link to="/admin/requests">Önskningar</Link>
  </div>
)

module.exports = Navigation