const React = require('react')
const Modal = require('../../services/Modal')
const RequestStore = require('../../stores/RequestStore')

class RequestSong extends React.Component {
  getFields() {
    return {
      name: this.refs.name.value,
      song: this.refs.song.value,
      text: this.refs.text.value
    }
  }

  setHref(ev) {
    const node = ev.currentTarget
    const fields = this.getFields()
    const string = `Jag vill höra "${fields.song}". ${fields.text} #julradio`

    if (string.length > 140) {
      return alert('För långt för Twitter. Önska direkt istället.')
    }

    node.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(string)
    setTimeout(() => node.href = '')

    if (!fields.song) {
      ev.preventDefault()
    }
  }

  requestSong() {
    const fields = this.getFields()

    if (fields.text.length > 250) {
      return alert('För lång text. Högst 250 tecken.')
    }

    RequestStore.request(fields).then(() => {
      Modal.close()
      alert('done.')
    }, () => {
      alert('något gick fel.')
    })
  }

  render() {
    return (
      <div className="RequestSong Modal">
        <header>Önska en låt</header>
        <main>
          <label>Ditt namn</label>
          <input type="text" ref="name" />
          <label>Låt</label>
          <input type="text" ref="song" />
          <label>Text</label>
          <textarea ref="text" maxLength={250} />
          <div className="submit">
            <button style={{marginRight: 10}} onClick={this.requestSong.bind(this)}>Skicka önskning</button>
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