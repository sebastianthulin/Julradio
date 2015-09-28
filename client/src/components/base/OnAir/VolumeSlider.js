var React = require('react')
var RadioStore = require('../../../stores/RadioStore')

class VolumeSlider extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('volume', volume => this.setState({volume}))
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
    var { volume } = this.state
    return (
      <div className="volume-slider" ref="slider" onMouseDown={this.initDrag.bind(this)}>
        <div className="volume" style={{width: volume * 100 + '%'}} />
        <div className="knot" />
      </div>
    )
  }
}

module.exports = VolumeSlider