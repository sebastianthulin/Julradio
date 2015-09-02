var React = require('react')

class Menu extends React.Component {
  render() {
    return (
      <div id="menu">
        <ul>
          <li>
            <a href="/">Nyheter</a>
          </li>
          <li>
            <a href="/">Önska</a>
          </li>
          <li>
            <a href="/">Community</a>
          </li>
          <li>
            <a href="/">Klotterplank</a>
          </li>
          <li>
            <a href="/">Chatt</a>
          </li>
          <li>
            <a href="/">Kontakt</a>
          </li>
        </ul>
      </div>
    )
  }
}

module.exports = Menu