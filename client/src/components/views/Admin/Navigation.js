var React = require('react')
var { Link } = require('react-router')

class Navigation extends React.Component {
  render() {
    return (
      <div className="three columns">
        <div className="group">
          <h4>Hantering</h4>
          <Link to="/admin/articles">Nyheter</Link>
          <a>Konton</a>
          <a>Tävlingar</a>
          <a>Poll</a>
        </div>
        <div className="group">
          <h4>Notiser</h4>
          <a>Önskningar (32)</a>
          <a>Granska profilbilder (4)</a>
          <a>Kommentarer (6)</a>
        </div>
      </div>
    )
  }
}

module.exports = Navigation