var React = require('react')

class RequestSong extends React.Component {
  render() {
    return (
      <div className="modal">
        <header>
          Önska en låt
        </header>
        <main>
          <h4>Önska en låt</h4>
          <input type="text" placeholder="Ditt Namn"/>
          <input type="text" placeholder="Låt"/>
          <textarea type="text" placeholder="Text" />
          <button>Önska via twitter</button>
          <button>Skicka önskning</button>
        </main>
      </div>
    )
  }
}

module.exports = RequestSong