var React = require('react')

class RequestSong extends React.Component {
  render() {
    return (
      <div className="modal">
        <header>
          Önska en låt
        </header>
        <main>
          <div className="left-column">
            <h4>Tweeta en önskning med #julradio</h4>
            <button>önska via twitter</button>
          </div>
          <div className="divider" />
          <div className="right-column">
            <h4>Önska en låt</h4>
            <input type="text" placeholder="Namn"/>
            <input type="text" placeholder="Låt"/>
            <textarea type="text" placeholder="Text" />
            <button>Skicka önskning</button>
          </div>
        </main>
      </div>
    )
  }
}

module.exports = RequestSong