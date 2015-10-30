const React = require('react')
const RadioStore = require('../../../stores/RadioStore')

class VolumeSlider extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('volume', volume => this.setState({ volume }))
  }

  initDrag(ev) {
    ev.preventDefault()
    this.handleDrag(ev)
    const handleDrag = this.handleDrag.bind(this)
    const endDrag = function() {
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', endDrag)
    }
    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', endDrag)
  }

  handleDrag(ev) {
    const rect = this.refs.slider.getBoundingClientRect()
    const offsetLeft = ev.clientX - rect.left
    RadioStore.setVolume(offsetLeft / rect.width)
  }

  render() {
    const { volume } = this.state
    return (
      <div id="VolumeSlider" ref="slider" onMouseDown={this.initDrag.bind(this)}>
        <div className="volume" style={{width: volume * 100 + '%'}} />
        <div className="handle" />
      </div>
    )
  }
}

module.exports = VolumeSlider