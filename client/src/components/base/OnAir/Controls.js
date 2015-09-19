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
    var mouseMoveHandler = this.handleDrag.bind(this)
    var mouseUpHandler = function() {
      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('mouseup', mouseUpHandler)
    }
    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
  }

  handleDrag(ev) {
    var slider = this.refs.slider.getDOMNode()
    var rect = slider.getBoundingClientRect()
    var left = ev.clientX - rect.left
    RadioStore.setVolume(left / rect.width)
  }

  render() {
    var { playing, volume } = this.state
    return (
      <div>
        <div className="volume-slider" ref="slider" onMouseDown={this.initDrag.bind(this)}>
          <div className="volume" style={{width: volume * 100 + '%'}} />
        </div>
        <button className="play-container" onClick={RadioStore.toggle}>
          {playing ? <i className="fa fa-pause" /> : <i className="fa fa-play" />}
          <span>{playing ? 'Pausa' : 'Starta Radio'}</span>
        </button>
      </div>
    )
  }
}

module.exports = Controls