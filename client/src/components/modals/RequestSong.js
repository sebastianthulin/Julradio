const React = require('react')
const {connect} = require('react-redux')
const {createRequest} = require('../../actions/requests')
const Modal = require('./Modal')

@connect(state => ({
  onAir: !!state.reservations.get('onAir')
}), {
  onCreateRequest: createRequest
})
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

    this.props.onCreateRequest(fields).then(err => {
      if (!err) {
        this.resetFields()
        this.props.closeModal()
      }
    })
  }

  render() {
    const {onAir} = this.props
    return (
      <Modal className="RequestSong">
        <header>Önska en låt</header>
        {onAir ? (
          <main>
            <label>Ditt namn</label>
            <input type="text" ref="name" maxLength={50} className="clean" />
            <label>Låt</label>
            <input type="text" ref="song" maxLength={100} className="clean" />
            <label>Text</label>
            <textarea ref="text" maxLength={250} className="clean" />
            <button style={{width: '48%', float: 'left'}} onClick={this.requestSong.bind(this)}>Skicka önskning</button>
            <a target="_blank" onClick={this.setHref.bind(this)}>
              <button style={{width: '48%', float: 'right'}}>Önska via Twitter</button>
            </a>
          </main>
        ) : (
          <main>
            <div className="cantwishyetbro">Spara din önskning till nästa sändning!</div>
          </main>
        )}
      </Modal>
    )
  }
}

module.exports = RequestSong
