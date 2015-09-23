var React = require('react')
var RadioStore = require('../../../stores/RadioStore')

class Controls extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('playing', this.handlePlaying.bind(this))
    RadioStore.subscribe('volume', this.handleVolume.bind(this))
  }

  handlePlaying(playing) {
    this.setState({playing})
  }

  handleVolume(volume) {
    this.setState({volume})
  }

  initDrag(ev) {
    ev.preventDefault()
    this.handleDrag(ev)
    var handleDrag = this.handleDrag.bind(this)
    var endDrag = function() {
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', endDrag)
    }
    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', endDrag)
  }

  handleDrag(ev) {
    var rect = this.refs.slider.getDOMNode().getBoundingClientRect()
    var offsetLeft = ev.clientX - rect.left
    RadioStore.setVolume(offsetLeft / rect.width)
  }

  render() {
    var { playing, volume } = this.state
    return (
      <div>
        <div className="volume-slider" ref="slider" onMouseDown={this.initDrag.bind(this)}>
          <div className="volume" style={{width: volume * 100 + '%'}} />
        </div>
        <button className="play-container" onClick={RadioStore.toggle}>
          <i className={playing ? 'fa fa-pause' : 'fa fa-play'} />
          <span>{playing ? 'Pausa' : 'Starta Radio'}</span>
        </button>
      </div>
    )
  }
}

module.exports = Controls