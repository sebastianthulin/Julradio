var React = require('react')

class LogIn extends React.Component {
  render() {
    return (
      <div className="modal">
        <header>
          Logga in
        </header>
        <main>
          <input type="text" placeholder="Ditt Namn"/>
          <input type="text" ref="songName" placeholder="Låt"/>
          <textarea type="text" ref="text" placeholder="Text" />
          <div className="submit">
            <button style={{marginRight: 10}}>Skicka önskning</button>
            <a target="_blank"><button>Önska via twitter</button></a>
          </div>
        </main>
      </div>
    )
  }
}

module.exports = LogIn