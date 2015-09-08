var React = require('react')

class RequestSong extends React.Component {
  setHref(ev) {
    var songName = this.refs.songName.getDOMNode().value
    if (!songName)
      return;
    var text = this.refs.text.getDOMNode().value
    var query = encodeURIComponent('Jag vill höra "' + songName + '". ' + text + ' #julradio')
    ev.currentTarget.href = 'https://twitter.com/intent/tweet?text=' + query
  }

  render() {
    return (
      <div className="modal">
        <header>
          Önska en låt
        </header>
        <main>
          <input type="text" placeholder="Ditt Namn"/>
          <input type="text" ref="songName" placeholder="Låt"/>
          <textarea type="text" ref="text" placeholder="Text" />
          <div className="submit">
            <button style={{marginRight: 10}}>Skicka önskning</button>
            <a target="_blank" onClick={this.setHref.bind(this)}><button>Önska via twitter</button></a>
          </div>
        </main>
      </div>
    )
  }
}

module.exports = RequestSong