const React = require('react')
const ModalService = require('../../services/Modal')
const RequestStore = require('../../stores/RequestStore')
const NotificationStore = require('../../stores/NotificationStore')
const Modal = require('./Modal')

class RequestSong extends React.Component {
  getFields() {
    return {
      name: this.refs.name.value,
      song: this.refs.song.value,
      text: this.refs.text.value
    }
  }

  resetFields() {
    this.refs.name.value = ''
    this.refs.song.value = ''
    this.refs.text.value = ''
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

    RequestStore.create(fields).then(() => {
      this.resetFields()
      ModalService.close()
      NotificationStore.insert({type: 'requestsong'})
    }).catch(err => {
      NotificationStore.error({type: 'requestsong', value: 'INVALID_FORM'})
    })
  }

  render() {
    return (
      <Modal className="RequestSong">
        <header>Önska en låt</header>
        <main>
          <label>Ditt namn</label>
          <input type="text" ref="name" maxLength={50} />
          <label>Låt</label>
          <input type="text" ref="song" maxLength={100} />
          <label>Text</label>
          <textarea ref="text" maxLength={250} />
          <button style={{width: '48%', float: 'left'}} onClick={this.requestSong.bind(this)}>Skicka önskning</button>
          <a target="_blank" onClick={this.setHref.bind(this)}>
            <button style={{width: '48%', float: 'right'}}>Önska via Twitter</button>
          </a>
        </main>
      </Modal>
    )
  }
}

module.exports = RequestSong