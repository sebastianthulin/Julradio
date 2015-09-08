var React = require('react')

class LogIn extends React.Component {
  render() {
    return (
      <div className="modal">
        <header>
          Logga in
        </header>
        <main>
          <input type="text" placeholder="Användarnamn"/>
          <input type="password" ref="songName" placeholder="Password"/>
          <div className="submit">
            <button>Logga in</button>
          </div>
        </main>
      </div>
    )
  }
}

module.exports = LogIn