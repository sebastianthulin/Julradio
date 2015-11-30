const React = require('react')
const cx = require('classnames')
const RadioStore = require('../../../stores/RadioStore')

class VolumeSlider extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('volume', volume => this.setState({ volume }))
  }

  initDrag(ev) {
    ev.preventDefault()
    this.handleDrag(ev)
    const handleDrag = this.handleDrag.bind(this)
    const endDrag = () => {
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', endDrag)
      this.setState({adjusting: false})
    }
    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', endDrag)
    this.setState({adjusting: true})
  }

  handleDrag(ev) {
    const rect = this.refs.slider.getBoundingClientRect()
    const offsetLeft = ev.clientX - rect.left
    RadioStore.setVolume(offsetLeft / rect.width)
  }

  render() {
    const { volume, adjusting } = this.state
    return (
      <div id="VolumeSlider" className={cx({ adjusting })} ref="slider" onMouseDown={this.initDrag.bind(this)}>
        <div className="volume" style={{width: volume * 100 + '%'}}>
          <div className="handle" />
        </div>
      </div>
    )
  }
}

module.exports = VolumeSlider