const React = require('react')
const { Link } = require('react-router')

const Navigation = () => (
  <div className="two columns">
    <div className="group">
      <h4>Hantering</h4>
      <Link to="/admin/articles">Nyheter</Link>
      <a>Tävlingar</a>
      <Link to="/admin/users">Konton</Link>
      <Link to="/admin/schedule">Tablå</Link>
    </div>
    <div className="group">
      <h4>Notiser</h4>
      <a>Önskningar (32)</a>
      <a>Granska profilbilder (4)</a>
      <a>Kommentarer (6)</a>
    </div>
  </div>
)

module.exports = Navigation