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
    const query = encodeURIComponent('Jag vill höra "' + fields.song + '". ' + fields.text + ' #julradio')

    node.href = 'https://twitter.com/intent/tweet?text=' + query
    setTimeout(() => node.href = '')

    if (!fields.song) {
      ev.preventDefault()
    }
  }

  requestSong() {
    RequestStore.request(this.getFields()).then(() => {
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
          <textarea ref="text" />
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