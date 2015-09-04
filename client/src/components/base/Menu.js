var React = require('react')
var { Link } = require('react-router')

class Menu extends React.Component {
  render() {
    return (
      <div id="menu">
        <ul>
          <li>
            <Link to="/">Nyheter</Link>
          </li>
          <li>
            <Link to="/wish">Önska</Link>
          </li>
          <li>
            <Link to="/">Community</Link>
          </li>
          <li>
            <Link to="/">Klotterplank</Link>
          </li>
          <li>
            <Link to="/">Chatt</Link>
          </li>
          <li>
            <Link to="/">Kontakt</Link>
          </li>
        </ul>
      </div>
    )
  }
}

module.exports = Menu