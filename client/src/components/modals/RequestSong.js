const React = require('react')

class RequestSong extends React.Component {
  setHref(ev) {
    const songName = this.refs.songName.value
    const text = this.refs.text.value
    const query = encodeURIComponent('Jag vill höra "' + songName + '". ' + text + ' #julradio')
    ev.currentTarget.href = 'https://twitter.com/intent/tweet?text=' + query

    if (!songName) {
      ev.preventDefault()
    }
  }

  render() {
    return (
      <div className="modal">
        <header>Önska en låt</header>
        <main>
          <label>Ditt namn</label>
          <input type="text" />
          <label>Låt</label>
          <input type="text" ref="songName" />
          <label>Text</label>
          <textarea ref="text" />
          <div className="submit">
            <button style={{marginRight: 10}}>Skicka önskning</button>
            <a target="_blank" onClick={this.setHref.bind(this)}>
              <button>Önska via twitter</button>
            </a>
          </div>
        </main>
      </div>
    )
  }
}

module.exports = RequestSong